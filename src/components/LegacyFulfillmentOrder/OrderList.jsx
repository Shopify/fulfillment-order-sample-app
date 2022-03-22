import { Button,  Card, IndexTable } from "@shopify/polaris";
import { userLoggedInFetch } from "../../App";
import { useAppBridge } from "@shopify/app-bridge-react";

export function OrderList({ orders }) {
    console.log(orders);
    const app = useAppBridge();
    const fulfillOrders = async (id) => {
        const authFetch = userLoggedInFetch(app);
        authFetch(`/orders/${id}?shop=liz-dev-5.myshopify.com`,
        {method: "POST", body: JSON.stringify({fulfillment: {location_id: 65670250663}}),headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },})
        .then(response => console.log(response))
        .catch(error => console.log(error))
    }



    const orderListItems = orders.map(
        ({ id }, index) => (
            <IndexTable.Row
                id={id}
                key={id}
                index={index}
                selected={false}>
                <IndexTable.Cell>{id}</IndexTable.Cell>
                <IndexTable.Cell>a message</IndexTable.Cell>
                <IndexTable.Cell>
                    <Button onClick={() => fulfillOrders(id)}>
                        Fulfill
                    </Button>
                </IndexTable.Cell>
            </IndexTable.Row>
        )
    )
    return (
        <Card>
            <IndexTable
                resourceName={{ singular: "order", plural: "orders" }}
                itemCount={orders.length}
                onSelectionChange=""
                headings={[
                    { title: "Order ID" },
                    { title: "Fulfillment Message" },
                    { title: "Fulfill Now" }

                ]}>
                {orderListItems}
            </IndexTable>
        </Card>
    );
}