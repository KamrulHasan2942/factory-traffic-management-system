const API_URL = 'http://localhost:3000';

export async function getJunction(
  junctionId: string,
) {
  const response = await fetch(
    `${API_URL}/api/junctions/${junctionId}`,
    {
      cache: 'no-store',
    },
  );

  if (!response.ok) {
    throw new Error(
      'Failed to fetch junction',
    );
  }

  return response.json();
}

export async function getQueue(
  junctionId: string,
) {
  const response = await fetch(
    `${API_URL}/api/junctions/${junctionId}/queue`,
    {
      cache: 'no-store',
    },
  );

  if (!response.ok) {
    throw new Error(
      'Failed to fetch queue',
    );
  }

  return response.json();
}