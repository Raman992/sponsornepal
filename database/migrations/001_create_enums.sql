-- Migration: 001_create_enums
-- Created: 2026-05-18
-- Description: Create all enum types used across the database

-- Create User Roles Enum (skip if exists)
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('creator', 'brand', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create Campaign Status Enum (skip if exists)
DO $$ BEGIN
  CREATE TYPE campaign_status AS ENUM ('draft', 'open', 'in_progress', 'completed', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create Application Status Enum (skip if exists)
DO $$ BEGIN
  CREATE TYPE application_status AS ENUM ('pending', 'accepted', 'rejected', 'completed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create Deal Status Enum (skip if exists)
DO $$ BEGIN
  CREATE TYPE deal_status AS ENUM ('pending', 'active', 'completed', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
