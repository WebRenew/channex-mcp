# Airbnb Integration Workflow with Channex MCP

## Prerequisites
- Channex account with API key
- Property already created in Channex
- Room types and rate plans configured
- Airbnb host account

## Step-by-Step Integration

### 1. Test Channel API Access
```typescript
// First, test if we have access to channel endpoints
channex_test_channel_api()
```

### 2. Check for Existing Connections
```typescript
// First, check if Airbnb is already connected
const check = await channex_check_existing_connection({
  channel_code: "airbnb",
  property_ids: ["your-property-id"]
});

if (check.has_existing_connection) {
  console.log("Airbnb already connected:", check.existing_connections);
  // Use existing channel ID for further operations
  const channelId = check.existing_connections[0].channel_id;
} else {
  // Proceed to create new connection
}
```

### 3. Create Airbnb Channel Connection (if not exists)
```typescript
// Only create if no existing connection found
if (!check.has_existing_connection) {
  channex_create_channel({
    channel_code: "airbnb",
    title: "My Airbnb Connection",
    property_ids: ["your-property-id"],
    settings: {
      min_stay_type: "arrival", // or "through"
      send_booking_notification_email: true
    }
  })
}
```

### 4. Complete OAuth Connection
- After creating the channel, you'll need to complete the OAuth flow in the Channex UI
- The channel will show as inactive until OAuth is completed
- If you get an error about existing channel manager, see troubleshooting section

### 5. List Available Airbnb Listings
```typescript
channex_get_airbnb_listings({
  channel_id: "channel-id-from-step-2"
})
```

### 5. Get Current Mappings
```typescript
channex_get_channel_mappings({
  channel_id: "channel-id-from-step-2"
})
```

### 6. Map Listings to Rate Plans
For each unmapped listing:
```typescript
channex_update_channel_mapping({
  channel_id: "channel-id",
  mapping_id: "mapping-id-from-step-5",
  data: {
    room_type_id: "your-room-type-id",
    rate_plan_id: "your-rate-plan-id",
    is_mapped: true
  }
})
```

### 7. Configure Airbnb-Specific Settings
```typescript
channex_update_airbnb_listing({
  channel_id: "channel-id",
  listing_id: "airbnb-listing-id",
  settings: {
    price_settings: {
      currency: "USD",
      default_daily_price: 100,
      default_weekend_price: 120,
      monthly_stay_discount: 10,
      weekly_stay_discount: 5,
      price_per_extra_guest: 20,
      guests_included: 2,
      security_deposit: 200,
      cleaning_fee: 50
    },
    availability_settings: {
      number_of_days: 365,
      number_of_hours: 24,
      preparation_time: 2,
      max_nights: 30,
      min_nights: 2,
      checkin_dates: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
      checkout_dates: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
    }
  }
})
```

### 8. Sync Rates and Availability
Use standard ARI tools to manage inventory:
```typescript
channex_update_ari({
  values: [{
    property_id: "your-property-id",
    rate_plan_id: "mapped-rate-plan-id",
    date_from: "2024-01-01",
    date_to: "2024-12-31",
    rate: 100,
    min_stay_arrival: 2,
    availability: 1
  }]
})
```

## Important Notes

### Occupancy-Based Pricing
Airbnb only supports one rate plan mapping per listing. To handle different occupancy rates:
1. Map the lowest occupancy rate plan (e.g., 1 guest)
2. Set "guests_included" in Airbnb settings
3. Set "price_per_extra_guest" for additional guests

### Min Stay Restrictions
- Airbnb uses "arrival" type min stay
- Configure in channel settings which min stay type to send
- Channex will convert "through" to "arrival" if needed

### Availability Updates
- Changes to availability sync automatically
- Full sync can be triggered through Channex UI
- Updates typically reflect within minutes

## Troubleshooting

### Connection Issues

#### Existing Channel Manager Connected
If you see "Another channel manager is already connected":
1. Log into Airbnb
2. Go to Account > Settings > Privacy & Sharing
3. Find "Connected apps" section
4. Disconnect the existing channel manager
5. Wait a few minutes for the disconnection to process
6. Retry the Channex connection

#### Channel Already Exists in Channex
If a channel already exists for your properties:
```typescript
// List existing channels
const channels = await channex_list_channels({
  channel_code: "airbnb",
  property_id: "your-property-id"
});

// If inactive, reactivate it
if (channels[0]?.attributes.is_active === false) {
  await channex_update_channel({
    id: channels[0].id,
    data: { is_active: true }
  });
}
```

#### Multiple Properties with Mixed Status
Some properties connected, others not:
```typescript
const check = await channex_check_existing_connection({
  channel_code: "airbnb", 
  property_ids: allPropertyIds
});

// Only connect unconnected properties
const unconnected = allPropertyIds.filter(id =>
  !check.existing_connections.some(c => 
    c.overlapping_properties.includes(id)
  )
);
```

### Mapping Issues
- Each listing can only map to one room type + rate plan
- Ensure rate plan has proper occupancy settings
- Verify room type count matches actual inventory

### Rate Sync Issues
- Check rate plan currency matches Airbnb listing
- Ensure rates are within Airbnb's min/max limits
- Verify no stop-sell restrictions blocking updates