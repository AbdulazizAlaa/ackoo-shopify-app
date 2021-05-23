import "isomorphic-fetch";
import { gql } from "apollo-boost";

export function ORDER_UTM_SOURCE(orderId) {
  return gql`
    {
      order(id: "gid://shopify/Order/${orderId}") {
        id
        customerJourney {
          moments {
            ... on CustomerVisit {
              utmParameters {
                source
              }
            }
          }
        }
      }
    }
  `;
}

export const getOrderUTMSource = async (ctx) => {
  const { client, order_id } = ctx;
  const utmSource = await client
    .mutate({
      mutation: ORDER_UTM_SOURCE(order_id)
    })
    .then(response => {
      console.log(response.data.order);
      const utmParams = response.data.order.customerJourney? response.data.order.customerJourney.moments.find(item => item['utmParameters'] != null) : null;
      return utmParams ? utmParams['utmParameters']['source'] : null;
    });

  return utmSource;
};
