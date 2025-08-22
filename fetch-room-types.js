import { roomTypesResource } from './dist/resources/room-types.js';

const propertyId = 'YOUR_PROPERTY_ID_HERE'; // Replace with your actual property ID

async function fetchRoomTypes() {
  try {
    console.log('Fetching room types for property...\n');
    
    const result = await roomTypesResource.list({
      filter: { property_id: propertyId }
    });
    
    console.log('Room Types:');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error fetching room types:', error);
  }
}

fetchRoomTypes();