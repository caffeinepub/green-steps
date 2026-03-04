import Map "mo:core/Map";
import Order "mo:core/Order";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Float "mo:core/Float";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  type CarbonFootprintEntry = {
    transportation : Float;
    electricity : Float;
    gas : Float;
    waste : Float;
    totalCO2 : Float;
    timestamp : Int;
  };

  type EntryInput = {
    transportation : Float;
    electricity : Float;
    gas : Float;
    waste : Float;
  };

  type EntryResult = {
    totalCO2 : Float;
    ecoPoints : Nat;
    ecoScore : Nat;
    carbonLevel : Text;
  };

  type UserLevel = {
    #beginner;
    #ecoWarrior;
    #greenChampion;
  };

  public type UserProfile = {
    name : Text;
  };

  module CarbonFootprintEntry {
    public func compare(entry1 : CarbonFootprintEntry, entry2 : CarbonFootprintEntry) : Order.Order {
      Float.compare(entry2.totalCO2, entry1.totalCO2);
    };
  };

  // State
  let entries = Map.empty<Principal, List.List<CarbonFootprintEntry>>();
  let userPoints = Map.empty<Principal, Nat>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Emission Factors
  let transportationFactor = 0.21;
  let electricityFactor = 0.233;
  let gasFactor = 2.04;
  let wasteFactor = 0.57;

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Core Functions
  public shared ({ caller }) func submitEntry(input : EntryInput) : async EntryResult {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit entries");
    };

    let totalCO2 = calculateTotalCO2(input);
    let carbonLevel = getCarbonLevel(totalCO2);

    let newEntry = {
      transportation = input.transportation;
      electricity = input.electricity;
      gas = input.gas;
      waste = input.waste;
      totalCO2;
      timestamp = Time.now();
    };

    let updatedList = switch (entries.get(caller)) {
      case (null) {
        let newList = List.empty<CarbonFootprintEntry>();
        newList.add(newEntry);
        newList;
      };
      case (?userList) {
        userList.add(newEntry);
        userList;
      };
    };

    entries.add(caller, updatedList);

    let ecoPoints = getEcoPoints(carbonLevel);

    let newTotalPoints = switch (userPoints.get(caller)) {
      case (null) { ecoPoints };
      case (?existing) { existing + ecoPoints };
    };
    userPoints.add(caller, newTotalPoints);

    {
      totalCO2;
      ecoPoints;
      ecoScore = calculateEcoScore(totalCO2);
      carbonLevel;
    };
  };

  public query ({ caller }) func getHistory() : async [CarbonFootprintEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view history");
    };

    switch (entries.get(caller)) {
      case (null) { [] };
      case (?userList) {
        userList.toArray();
      };
    };
  };

  public query ({ caller }) func getLatestEntry() : async ?CarbonFootprintEntry {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view latest entry");
    };

    switch (entries.get(caller)) {
      case (null) { null };
      case (?userList) { userList.first() };
    };
  };

  public query ({ caller }) func getTotalPoints() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view total points");
    };

    switch (userPoints.get(caller)) {
      case (null) { 0 };
      case (?points) { points };
    };
  };

  public query ({ caller }) func getUserLevel() : async UserLevel {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view user level");
    };

    switch (userPoints.get(caller)) {
      case (null) { #beginner };
      case (?points) {
        if (points < 200) { #beginner } else if (points < 500) {
          #ecoWarrior;
        } else {
          #greenChampion;
        };
      };
    };
  };

  public shared ({ caller }) func deleteEntry(index : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete entries");
    };

    switch (entries.get(caller)) {
      case (null) {
        Runtime.trap("No entries found");
      };
      case (?userEntries) {
        let listSize = userEntries.size();
        if (index >= listSize) {
          Runtime.trap("Entry index out of bounds");
        };
        let currentArray = userEntries.toArray();
        let filteredArray = currentArray.sliceToArray(0, index).concat(currentArray.sliceToArray(index + 1, listSize));
        entries.add(caller, List.fromArray<CarbonFootprintEntry>(filteredArray));
      };
    };
  };

  // Helper Functions
  func calculateTotalCO2(input : EntryInput) : Float {
    (input.transportation * transportationFactor) +
    (input.electricity * electricityFactor) +
    (input.gas * gasFactor) +
    (input.waste * wasteFactor)
  };

  func getCarbonLevel(totalCO2 : Float) : Text {
    if (totalCO2 < 50.0) {
      "Low";
    } else if (totalCO2 < 150.0) {
      "Medium";
    } else {
      "High";
    };
  };

  func getEcoPoints(level : Text) : Nat {
    switch (level) {
      case ("Low") { 100 };
      case ("Medium") { 50 };
      case ("High") { 20 };
      case (_) { 0 };
    };
  };

  func calculateEcoScore(totalCO2 : Float) : Nat {
    let score = 100.0 - ((totalCO2 / 200.0) * 100.0);
    if (score < 0.0) {
      0;
    } else if (score > 100.0) {
      100;
    } else {
      score.toInt().toNat();
    };
  };
};
