export function FulfillmentOrderList({ fulfillmentOrders }) {

  return (
    <>
      {
        fulfillmentOrders.map(({id}) => <p>{id}</p>)
      }
    </>
  )
}
