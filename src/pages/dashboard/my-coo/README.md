# My COO Feature

This folder contains the "My COO" feature of the CCO Platform, which provides data integration workflows and connections to external services.

## Features

- View existing integration workflows
- Create new integration workflows
- Edit existing workflows with a visual node editor
- Manage workflow statuses (active, paused, etc.)

## Component Structure

- `index.tsx` - Main entry point for the My COO feature
- Integration with the DataIntegrationNodeEditor component for visual workflow editing

## Development Notes

This feature depends on:
- `DataIntegrationNodeEditor` component for visual node editing
- `mockData.ts` for integration workflow data
- Type definitions from the main types file

## Current Issues

There may be TypeScript errors related to the workflow types in the mock data. The `status` property in the mock data needs to be strictly typed as `"active" | "paused" | "draft" | "archived"` rather than a generic string. 