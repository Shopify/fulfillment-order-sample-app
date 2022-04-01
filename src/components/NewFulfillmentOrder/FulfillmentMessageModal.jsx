import { useState } from 'react';
import { TextField, Modal } from '@shopify/polaris';
export default function FulfillmentMessageModal({ open, saveMessage }) {
  const [message, setMessage] = useState('');
  return (
    <Modal
      title="Fulfillment Message"
      message="Write your message plz"
      open={open}
      onClose={() => saveMessage('')}
      primaryAction={{
        content: 'Add Message',
        onAction: () => saveMessage(message),
      }}
      secondaryActions={[
        {
          content: 'Cancel',
          onAction: () => saveMessage(''),
        },
      ]}
    >
      <Modal.Section>
      <TextField
        label="Fulfillment Message"
        value={message}
        onChange={setMessage}
      />
      </Modal.Section>
    </Modal>
  );
}
