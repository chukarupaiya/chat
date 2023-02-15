export async function myFunction() {
    // const response = await PushAPI.user.getFeeds({
    //   user: 'eip155:80001:0xdb340A9B85b9C2C5b25aA06E182472B02edC8Cde', // user address in CAIP
    //   spam: true,
    //   limit: 1,
    //   env: 'staging',
    // });
  
  
  //https://backend-staging.epns.io/apis/v1/users/eip155:80001:0xdb340A9B85b9C2C5b25aA06E182472B02edC8Cde/feeds?spam=true
    const resp = await fetch('https://backend-staging.epns.io/apis/v1/users/eip155:80001:0xdb340A9B85b9C2C5b25aA06E182472B02edC8Cde/feeds ');
    const json = await resp.json();
    console.log(json);
  
    //   const res = await response.json();
      const stringifiedResponse = JSON.stringify(json);
      const hlo = JSON.parse(stringifiedResponse);
    const notification = hlo.feeds[0].payload.notification.body;
    // const title = notification.title;
    const body = notification.body;
  
      // return body;
    return notification;
  }
  