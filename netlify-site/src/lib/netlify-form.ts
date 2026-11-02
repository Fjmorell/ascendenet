/**
 * Submits a form to Netlify Forms. The form name and its fields must also be
 * declared in the hidden forms of index.html, or Netlify drops the submission.
 */
export async function submitNetlifyForm(formName: string, fields: Record<string, string>): Promise<void> {
    const body = new URLSearchParams({ 'form-name': formName, ...fields });

    const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
    });

    if (!response.ok) {
        throw new Error(`Form submission failed with status ${response.status}`);
    }
}

export type Errors<T extends string> = Partial<Record<T, string>>;

export function normalizePhone(phone: string): string {
    return phone.replace(/[\s\-().]/g, '');
}

export const isSpanishPhone = (phone: string) => /^(\+34|0034)?[6789]\d{8}$/.test(normalizePhone(phone));

export const isEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
