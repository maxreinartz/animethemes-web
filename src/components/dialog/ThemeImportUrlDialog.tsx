import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import styled from "styled-components";

import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

import { Column, Row } from "@/components/box/Flex";
import { Button } from "@/components/button/Button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/dialog/Dialog";
import { Input } from "@/components/form/Input";
import { Icon } from "@/components/icon/Icon";
import { SearchFilter } from "@/components/search-filter/SearchFilter";
import { Text } from "@/components/text/Text";
import { Busy } from "@/components/utils/Busy";

interface ThemeImportUrlDialogProps {
    trigger: ReactNode;
    onImport: (url: string) => Promise<boolean>;
}

export function ThemeImportUrlDialog({ trigger, onImport }: ThemeImportUrlDialogProps) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent title="Import Theme from URL">
                {open ? (
                    <ThemeImportUrlForm onSuccess={() => setOpen(false)} onCancel={() => setOpen(false)} onImport={onImport} />
                ) : null}
            </DialogContent>
        </Dialog>
    );
}

const StyledForm = styled.form`
    position: relative;
`;

interface ThemeImportUrlFormProps {
    onSuccess(): void;
    onCancel(): void;
    onImport: (url: string) => Promise<boolean>;
}

function ThemeImportUrlForm({ onSuccess, onCancel, onImport }: ThemeImportUrlFormProps) {
    const [url, setUrl] = useState("");
    const [showWarning, setShowWarning] = useState(true);

    const isValid = url.trim() !== "";

    const [isBusy, setBusy] = useState(false);
    const [error, setError] = useState("");

    async function submit(event: FormEvent) {
        event.preventDefault();

        if (showWarning) {
            setShowWarning(false);
            return;
        }

        setBusy(true);
        setError("");

        try {
            const success = await onImport(url.trim());
            if (!success) {
                setError("Failed to import theme. Please make sure the URL points to a valid JSON theme file.");
                return;
            }
        } catch {
            setError("Failed to fetch theme from URL. Please check the URL and try again.");
            return;
        } finally {
            setBusy(false);
        }

        onSuccess();
    }

    if (showWarning) {
        return (
            <Column style={{ "--gap": "24px" }}>
                <Text>
                    Importing custom themes can pose security risks as they may contain malicious code or
                    inappropriate content. Please ensure that you trust the source of the theme before importing.
                </Text>
                <Row $wrap style={{ "--gap": "8px", "--justify-content": "flex-end" }}>
                    <Button variant="silent" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button variant="warning" disabled={isBusy} onClick={() => submit({ preventDefault: () => {} } as FormEvent)}>
                        <Busy isBusy={isBusy}>Confirm</Busy>
                    </Button>
                </Row>
                {error ? (
                    <Text color="text-warning">
                        <Icon icon={faCircleExclamation} /> {error}
                    </Text>
                ) : null}
            </Column>
        );
    }

    return (
        <StyledForm onSubmit={submit}>
            <Column style={{ "--gap": "24px" }}>
                <SearchFilter>
                    <Text>Theme URL</Text>
                    <Input value={url} onChange={setUrl} inputProps={{ placeholder: "Enter theme URL..." }} />
                </SearchFilter>
                <Row $wrap style={{ "--gap": "8px", "--justify-content": "flex-end" }}>
                    <Button type="button" variant="silent" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" disabled={!isValid || isBusy}>
                        <Busy isBusy={isBusy}>Import</Busy>
                    </Button>
                </Row>
                {error ? (
                    <Text color="text-warning">
                        <Icon icon={faCircleExclamation} /> {error}
                    </Text>
                ) : null}
            </Column>
        </StyledForm>
    );
}
