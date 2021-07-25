import React, { useState } from 'react';
import { Dialog, Pane, TextInputField } from 'evergreen-ui';

interface DialogProps {
  isShown: boolean;
  closeCallback(): void;
  confirmCallback(name: string): void;
}

export function NewCameraDialog({ isShown, closeCallback, confirmCallback }: DialogProps) {
  const [name, setName] = useState('');
  return (
    <Pane>
      <Dialog
        isShown={isShown}
        title="Give it a name."
        confirmLabel="Confirm Name"
        data-name="camera-dialog-submit"
        onCloseComplete={() => closeCallback()}
        onConfirm={() => {
          confirmCallback(name);
        }}
      >
        <TextInputField
          label="Camera Name"
          data-name="enter-camera-name"
          required
          value={name}
          onChange={(e: React.FormEvent<HTMLInputElement>) => setName(e.currentTarget.value)}
        />
      </Dialog>
    </Pane>
  );
}
