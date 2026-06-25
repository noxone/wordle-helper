export interface SelectOption {
    value: string;
    label: string;
}

export function populateSelectOptions(
    select: HTMLSelectElement,
    options: SelectOption[],
    selectedValue: string,
): void {
    select.innerHTML = "";

    options.forEach((selectOption) => {
        const option = document.createElement("option");
        option.value = selectOption.value;
        option.textContent = selectOption.label;
        select.appendChild(option);
    });

    select.value = selectedValue;
}
