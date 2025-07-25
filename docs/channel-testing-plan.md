# Channel API Testing Plan

## Overview
This document outlines the testing strategy for the new channel management tools in the Channex MCP server. All testing will be performed against the live Channex API.

## Testing Phases

### Phase 1: API Discovery
Use `channex_test_channel_api` to determine which endpoints are accessible.

Expected outcomes:
1. **Full Access**: All channel endpoints return 200 OK
2. **Whitelabel Required**: Endpoints return 403 Forbidden
3. **Alternative Endpoints**: Some variations of endpoints may work

### Phase 2: Based on API Access Results

#### If Full Access Available:
1. **List Channels**
   - Test `channex_list_channels` without filters
   - Test with property_id filter
   - Test with channel_code filter (e.g., 'airbnb')
   - Document response structure

2. **Channel CRUD Operations**
   - Create test channel with `channex_create_channel`
   - Get channel details with `channex_get_channel`
   - Update channel with `channex_update_channel`
   - Delete test channel with `channex_delete_channel`

3. **Mapping Operations**
   - Get channel mappings with `channex_get_channel_mappings`
   - Update mapping with `channex_update_channel_mapping`
   - Test mapping Airbnb listings to rate plans

4. **Airbnb-Specific Features**
   - Get Airbnb listings with `channex_get_airbnb_listings`
   - Update listing settings with `channex_update_airbnb_listing`

#### If No Channel API Access:
1. **Metadata Approach**
   - Test adding channel metadata to property updates
   - Use rate plan titles to indicate channel mappings
   - Document workarounds for channel management

### Phase 3: Integration Testing
1. **Complete Airbnb Setup Flow**
   - Create property
   - Create room types
   - Create rate plans with occupancy-based pricing
   - Connect Airbnb channel (if possible)
   - Map listings to rate plans
   - Configure pricing and availability settings

2. **ARI Updates for Channels**
   - Test updating rates for channel-mapped rate plans
   - Verify restrictions apply correctly
   - Test availability updates

## Test Data Requirements
- Active Channex account with API access
- At least one test property
- Room types and rate plans configured
- Airbnb account (if testing full integration)

## Success Criteria
1. All accessible endpoints documented with actual responses
2. Error handling works correctly for restricted endpoints
3. Alternative approaches documented for limited access
4. Complete workflow tested end-to-end

## Documentation Updates
After testing:
1. Update types based on actual API responses
2. Document any API quirks or limitations
3. Create user guide for channel setup
4. Update CLAUDE.md with findings