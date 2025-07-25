# Handling Existing Channel Connections

## Overview
When attempting to connect a channel (like Airbnb) to properties in Channex, several scenarios can occur if a channel is already connected. This document explains how to handle each scenario.

## Common Scenarios

### 1. Channel Already Connected to Same Property
**Symptom**: Attempting to create a new Airbnb connection for a property that already has an active Airbnb connection.

**What Happens**:
- For Airbnb: Only one channel manager can be connected at a time per Airbnb account
- The API may return an error or the OAuth flow will fail
- Airbnb will show an error message indicating another channel manager is connected

**Solution**:
```typescript
// First, check for existing connections
const check = await channex_check_existing_connection({
  channel_code: "airbnb",
  property_ids: ["property-id-1", "property-id-2"]
});

if (check.has_existing_connection) {
  // Use the existing channel instead of creating a new one
  const existingChannel = check.existing_connections[0];
  console.log(`Channel already exists: ${existingChannel.channel_id}`);
}
```

### 2. Different Channel Manager Connected in OTA
**Symptom**: Another channel manager (not Channex) is connected to the Airbnb account.

**What Happens**:
- OAuth connection will fail
- Airbnb will display: "You already have a channel manager connected"
- Connection cannot proceed until the other channel manager is disconnected

**Solution**:
1. User must log into Airbnb
2. Go to Account Settings > Privacy & Sharing
3. Find "Connected apps" or "Channel managers"
4. Disconnect the existing channel manager
5. Retry the Channex connection

### 3. Inactive Channel Connection Exists
**Symptom**: A Channex channel exists but is marked as inactive (disconnected).

**What Happens**:
- The channel appears in the list but `is_active: false`
- Mappings may still exist but aren't syncing
- Can usually be reactivated rather than recreated

**Solution**:
```typescript
// Find inactive channels
const channels = await channex_list_channels({
  channel_code: "airbnb",
  is_active: false
});

// Reactivate if found
if (channels.length > 0) {
  await channex_update_channel({
    id: channels[0].id,
    data: { is_active: true }
  });
}
```

### 4. Multiple Properties, Partial Connection
**Symptom**: Trying to connect multiple properties, but some are already connected.

**What Happens**:
- Some properties may already be in another channel
- Cannot create duplicate connections for the same property

**Solution**:
```typescript
// Check which properties are already connected
const check = await channex_check_existing_connection({
  channel_code: "airbnb",
  property_ids: ["prop-1", "prop-2", "prop-3"]
});

// Filter out already connected properties
const unconnectedProperties = propertyIds.filter(id => 
  !check.existing_connections.some(conn => 
    conn.overlapping_properties.includes(id)
  )
);

// Create channel only for unconnected properties
if (unconnectedProperties.length > 0) {
  await channex_create_channel({
    channel_code: "airbnb",
    title: "Airbnb Connection - Additional Properties",
    property_ids: unconnectedProperties
  });
}
```

## Best Practices

### 1. Always Check First
Before creating a new channel:
```typescript
// Standard pre-connection check
async function preConnectionCheck(channelCode, propertyIds) {
  // Check existing connections
  const existing = await channex_check_existing_connection({
    channel_code: channelCode,
    property_ids: propertyIds
  });
  
  if (existing.has_existing_connection) {
    return {
      canCreate: false,
      reason: "Properties already connected",
      existing: existing.existing_connections
    };
  }
  
  return { canCreate: true };
}
```

### 2. Handle OAuth Failures Gracefully
For OAuth-based channels like Airbnb:
- Provide clear error messages
- Guide users to disconnect existing channel managers
- Offer to reuse existing inactive connections

### 3. Multi-Property Considerations
When dealing with multiple properties:
- Check each property individually
- Group properties by their connection status
- Allow partial connections where appropriate

## Error Handling

### Common Error Responses

1. **Channel Already Exists**
```json
{
  "errors": {
    "code": "channel_exists",
    "title": "Channel already exists for these properties",
    "details": {
      "existing_channel_id": "123-456",
      "conflicting_properties": ["prop-1", "prop-2"]
    }
  }
}
```

2. **OAuth Connection Blocked**
```json
{
  "errors": {
    "code": "oauth_blocked",
    "title": "Another channel manager is connected",
    "details": {
      "message": "Please disconnect existing channel manager in Airbnb"
    }
  }
}
```

3. **Property Already Mapped**
```json
{
  "errors": {
    "code": "property_mapped",
    "title": "Property already mapped to another channel",
    "details": {
      "property_id": "prop-1",
      "existing_channel_id": "channel-123"
    }
  }
}
```

## Workflow for Safe Channel Creation

```typescript
async function safeCreateChannel(channelCode, title, propertyIds, settings) {
  try {
    // Step 1: Check for existing connections
    const check = await channex_check_existing_connection({
      channel_code: channelCode,
      property_ids: propertyIds
    });
    
    if (check.has_existing_connection) {
      // Step 2: Handle existing connections
      console.log("Found existing connections:", check.existing_connections);
      
      // Option A: Use existing channel
      // Option B: Filter out connected properties
      // Option C: Abort and inform user
      
      return {
        success: false,
        reason: "existing_connection",
        existing: check.existing_connections
      };
    }
    
    // Step 3: Attempt to create channel
    const channel = await channex_create_channel({
      channel_code: channelCode,
      title: title,
      property_ids: propertyIds,
      settings: settings
    });
    
    return {
      success: true,
      channel: channel
    };
    
  } catch (error) {
    // Step 4: Handle creation errors
    if (error.response?.data?.errors?.code === 'oauth_required') {
      return {
        success: false,
        reason: "oauth_required",
        message: "Complete OAuth connection in Channex UI"
      };
    }
    
    throw error;
  }
}
```

## Channel-Specific Considerations

### Airbnb
- Only one channel manager per Airbnb account
- OAuth must be completed for each property owner
- Disconnecting removes all property connections

### Booking.com
- Supports multiple connections
- Uses XML credentials instead of OAuth
- Can have different connections for different properties

### Expedia
- Requires EPC (Expedia Partner Central) setup
- Can connect multiple properties under one account
- Uses API credentials

## Troubleshooting Checklist

1. ✓ Check for existing Channex connections
2. ✓ Verify no other channel managers are connected in OTA
3. ✓ Ensure OAuth permissions are properly set
4. ✓ Confirm property IDs are correct
5. ✓ Check if connections are active or inactive
6. ✓ Verify API access level (whitelabel vs standard)
7. ✓ Test with single property before bulk operations