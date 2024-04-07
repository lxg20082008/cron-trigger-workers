addEventListener('scheduled', event => {
  event.waitUntil(handleScheduledEvent(event))
})

async function handleScheduledEvent(event) {
  try {
    const currentData = await getAllKVData()
    const previousData = await getPreviousData()

    if (!isDataEqual(currentData, previousData)) {
      await triggerAutoUpdateUsingHook()
    }

    await saveCurrentData(currentData)
  } catch (error) {
    console.error('An error occurred while handling scheduled event:', error)
  }
}

async function getAllKVData() {
  const namespace = process.env.KV_NAMESPACE || 'txt'
  const kvEntries = KV.list({ namespace })
  const data = {}

  for await (const { key, value } of kvEntries) {
    data[key] = await KV.get(key, { namespace })
  }

  return data
}

async function getPreviousData() {
  return await KV.get('previous_data')
}

async function saveCurrentData(data) {
  await KV.put('previous_data', JSON.stringify(data))
}

function isDataEqual(data1, data2) {
  return JSON.stringify(data1) === JSON.stringify(data2)
}

async function triggerAutoUpdateUsingHook() {
  const deploymentHookUrl = process.env.HOOK_URL

  if (!deploymentHookUrl) {
    console.error('HOOK_URL environment variable not found.');
    return;
  }

  try {
    const response = await fetch(deploymentHookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: 'Deployment triggered by KV update' })
    });

    if (response.ok) {
      console.log('Deployment triggered successfully via deployment hook.');
    } else {
      console.error('Failed to trigger deployment via hook:', response.statusText);
    }
  } catch (error) {
    console.error('An error occurred while triggering deployment via hook:', error);
  }
}
