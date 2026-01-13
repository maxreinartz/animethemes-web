import { useState } from "react";
import type { ReactNode } from "react";

import { Column, Row } from "@/components/box/Flex";
import { Button } from "@/components/button/Button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/dialog/Dialog";
import { Text } from "@/components/text/Text";

interface ThemeWarningDialogProps {
    trigger: ReactNode;
    onConfirm: () => void;
}

export function ThemeWarningDialog({ trigger, onConfirm }: ThemeWarningDialogProps) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent title="Import Custom Theme">
                <Column style={{ "--gap": "24px" }}>
                    <Text>
                        Importing custom themes can pose security risks. They may contain malicious code or
                        inappropriate content. Please ensure that you trust the source of the theme before importing.
                    </Text>
                    <Row $wrap style={{ "--gap": "8px", "--justify-content": "flex-end" }}>
                        <Button variant="silent" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="warning" onClick={() => {
                            setOpen(false);
                            onConfirm();
                        }}>
                            Confirm
                        </Button>
                    </Row>
                </Column>
            </DialogContent>
        </Dialog>
    );
}