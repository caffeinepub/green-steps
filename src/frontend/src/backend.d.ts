import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CarbonFootprintEntry {
    gas: number;
    transportation: number;
    electricity: number;
    totalCO2: number;
    timestamp: bigint;
    waste: number;
}
export interface EntryResult {
    ecoScore: bigint;
    totalCO2: number;
    ecoPoints: bigint;
    carbonLevel: string;
}
export interface UserProfile {
    name: string;
}
export interface EntryInput {
    gas: number;
    transportation: number;
    electricity: number;
    waste: number;
}
export enum UserLevel {
    ecoWarrior = "ecoWarrior",
    beginner = "beginner",
    greenChampion = "greenChampion"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteEntry(index: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getHistory(): Promise<Array<CarbonFootprintEntry>>;
    getLatestEntry(): Promise<CarbonFootprintEntry | null>;
    getTotalPoints(): Promise<bigint>;
    getUserLevel(): Promise<UserLevel>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitEntry(input: EntryInput): Promise<EntryResult>;
}
