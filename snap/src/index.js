
import { myFunction } from "./fetch";

module.exports.onCronjob = async ({ request }) => {

  switch (request.method) {
    case 'inApp':
      return wallet.request({
        method: 'snap_notify',
        params: [
          {
            type: 'inApp',
            message: await myFunction(),
          },
        ],
      });
      case 'native':
        return wallet.request({
          method: 'snap_notify',
          params: [
            {
              type: 'native',
              message: `Hello`,
            },
          ],
        });
    default:
      throw new Error('Method not found.');
  }
};
