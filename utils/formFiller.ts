export const fillFormInPage = async (suggestions: any[]) => {
    console.log("InstantApply: Starting robust form fill...", suggestions);

    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

    const setNativeValue = (element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, value: string) => {
        const valueSetter = Object.getOwnPropertyDescriptor(element, 'value')?.set;
        const prototype = Object.getPrototypeOf(element);
        const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;

        if (valueSetter && valueSetter !== prototypeValueSetter) {
            prototypeValueSetter?.call(element, value);
        } else {
            valueSetter?.call(element, value);
        }

        element.value = value;
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.dispatchEvent(new Event('blur', { bubbles: true }));
    };

    const findInput = (s: any) => {
        // Strategy 1: Exact Name/ID
        const cleanName = s.fieldName?.replace(/^name=['"]?|['"]?$/g, '');
        if (cleanName) {
            const exact = document.querySelector(`[name="${cleanName}"], [id="${cleanName}"]`);
            if (exact) return exact;
        }

        // Strategy 2: Label Text
        if (s.label) {
            const labels = Array.from(document.querySelectorAll('label'));
            const matchingLabel = labels.find(l => l.textContent?.toLowerCase().includes(s.label.toLowerCase()));
            if (matchingLabel) {
                if (matchingLabel.htmlFor) return document.getElementById(matchingLabel.htmlFor);
                return matchingLabel.querySelector('input, textarea, select');
            }
        }

        // Strategy 3: Placeholder
        if (s.label || s.fieldName) {
            const text = (s.label || s.fieldName).toLowerCase();
            const inputs = Array.from(document.querySelectorAll('input, textarea, select'));
            return inputs.find((i: any) => i.placeholder && i.placeholder.toLowerCase().includes(text));
        }
        return null;
    };

    let totalFilled = 0;
    // Retry loop: Try to fill 3 times over 3 seconds to catch delayed fields
    for (let attempt = 1; attempt <= 3; attempt++) {
        console.log(`InstantApply: Fill Attempt ${attempt}`);
        let attemptFilled = 0;

        for (const s of suggestions) {
            if (!s.suggestedValue) continue;

            const input: any = findInput(s);
            if (!input) continue;

            // Skip if already filled with correct value (approximate)
            if (input.value === s.suggestedValue) continue;

            try {
                if (input.type === 'radio') {
                    // Radio logic
                    const radios = document.querySelectorAll(`input[name="${input.name}"][type="radio"]`);
                    let targetRadio: any = Array.from(radios).find((r: any) => r.value === s.suggestedValue);
                    if (!targetRadio) {
                        // Fuzzy label match for radio
                        targetRadio = Array.from(radios).find((r: any) => {
                            const wrapper = r.closest('label') || r.parentElement;
                            return wrapper?.textContent?.toLowerCase().includes(s.suggestedValue.toLowerCase());
                        });
                    }
                    if (targetRadio) {
                        targetRadio.click(); // Click is best for radios
                        attemptFilled++;
                    }
                } else if (input.type === 'checkbox') {
                    const shouldBeChecked = ['true', 'yes', 'on'].includes(String(s.suggestedValue).toLowerCase());
                    if (input.checked !== shouldBeChecked) {
                        input.click();
                        attemptFilled++;
                    }
                } else if (input.tagName === 'SELECT') {
                    // Smart Select: Match value or Option Text
                    let finalValue = s.suggestedValue;
                    const options = Array.from(input.options) as HTMLOptionElement[];

                    // Check if value exists
                    const valueMatch = options.find(o => o.value === s.suggestedValue);
                    if (!valueMatch) {
                        // Check if text matches
                        const textMatch = options.find(o => o.text.toLowerCase().includes(s.suggestedValue.toLowerCase()));
                        if (textMatch) {
                            finalValue = textMatch.value; // Use the value of the matching text
                        }
                    }

                    if (input.value !== finalValue) {
                        setNativeValue(input, finalValue);
                        attemptFilled++;
                    }
                } else {
                    // Text/Textarea
                    if (input.value !== s.suggestedValue) {
                        setNativeValue(input, s.suggestedValue);
                        attemptFilled++;
                    }
                }
            } catch (e) {
                console.error(`InstantApply: Failed to fill ${s.fieldName}`, e);
            }
        }

        totalFilled += attemptFilled;
        if (attempt < 3) await sleep(1000); // Wait for potential re-renders
    }

    console.log(`InstantApply: Finished. Filled ${totalFilled} fields.`);
    return { filled: totalFilled };
};
