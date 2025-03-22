/**
 * Client-side function to test the superadmin API for assigning a club to a user
 */

export async function assignClubToUser(userId: string, club: string) {
  try {
    const response = await fetch('/api/superadmin/manage-users', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        action: 'assign-club',
        data: { club },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to assign club to user');
    }

    const data = await response.json();
    console.log('Success:', data.message);
    return data;
  } catch (error) {
    console.error('Error assigning club to user:', error);
    throw error;
  }
}

/**
 * Example usage:
 * 
 * import { assignClubToUser } from '@/app/test-superadmin-api';
 * 
 * // For the specific example provided:
 * assignClubToUser("67dde16e8d366dedcab6db15", "ACM")
 *   .then(result => console.log(result))
 *   .catch(error => console.error(error));
 */ 