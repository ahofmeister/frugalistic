import {CommandLoading} from "cmdk"
import {type KeyboardEvent, useCallback, useEffect, useRef, useState} from "react"
import {cn} from "@/lib/utils";
import {Skeleton} from "@/components/ui/skeleton";
import {Command, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {TransactionAutoSuggest} from "@/types";
import {getColor} from "@/components/transactions/components/transaction-amount";

type AutoCompleteProps = {
    options: TransactionAutoSuggest[]
    value?: TransactionAutoSuggest
    onValueChange?: (value: TransactionAutoSuggest) => void
    isLoading?: boolean
    disabled?: boolean
    placeholder?: string
}

export const AutoComplete = ({
                                 options,
                                 placeholder,
                                 value,
                                 onValueChange,
                                 disabled,
                                 isLoading = false,
                             }: AutoCompleteProps) => {
    const inputRef = useRef<HTMLInputElement>(null)

    const [isOpen, setOpen] = useState(false)
    const [selected, setSelected] = useState<TransactionAutoSuggest | undefined>(value)
    const [inputValue, setInputValue] = useState<string>(value?.description || "")

    const handleKeyDown = useCallback(
        (event: KeyboardEvent<HTMLDivElement>) => {
            const input = inputRef.current
            if (!input) {
                return
            }

            if (!isOpen) {
                setOpen(true)
            }

            if (event.key === "Enter" && input.value !== "") {
                const optionToSelect = options.find(
                    (option) => option.unique_id?.toString() === input.value,
                )
                if (optionToSelect) {
                    setSelected(optionToSelect)
                    onValueChange?.(optionToSelect)
                }
            }

            if (event.key === "Escape") {
                input.blur()
            }
        },
        [isOpen, options, onValueChange],
    )

    const handleBlur = useCallback(() => {
        setOpen(false)
    }, [selected])

    const handleSelectOption = useCallback(
        (selectedOption: TransactionAutoSuggest) => {
            setInputValue(selectedOption.description!)

            setSelected(selectedOption)
            onValueChange?.(selectedOption)

            // This is a hack to prevent the input from being focused after the user selects an option
            // We can call this hack: "The next tick"
            setTimeout(() => {
                inputRef?.current?.blur()
            }, 0)
        },
        [onValueChange],
    )

    useEffect(() => {
        if (onValueChange && inputValue) {
            onValueChange({
                category: null,
                color: null,
                frequency: null,
                name: null,
                type: null,
                unique_id: null,
                description: inputValue
            })
        }
    }, [inputValue]);

    return (
        <Command onKeyDown={handleKeyDown}>
            <CommandInput
                ref={inputRef}
                value={inputValue}
                onValueChange={isLoading ? undefined : setInputValue}
                onBlur={handleBlur}
                onFocus={() => setOpen(true)}
                placeholder={placeholder}
                disabled={disabled}
            />
            <div className="relative mt-1">
                <div
                    className={cn(
                        isOpen ? "block" : "hidden",
                    )}
                >
                    <CommandList>
                        {isLoading ? (
                            <CommandLoading>
                                <div className="p-1">
                                    <Skeleton className="h-8 w-full"/>
                                </div>
                            </CommandLoading>
                        ) : null}
                        {options.length > 0 && !isLoading ? (
                            <CommandGroup>
                                {options.map((option) => {
                                    return (
                                        <CommandItem
                                            key={option.unique_id}
                                            value={option.unique_id?.toString() + " " + option.description}
                                            onMouseDown={(event: any) => {
                                                event.preventDefault()
                                                event.stopPropagation()
                                            }}
                                            onSelect={() => handleSelectOption(option)}
                                            className={cn(
                                                "flex w-full items-center gap-2",
                                            )}
                                        >
                                            <span className={getColor((option.type!))}
                                                  style={{color: getColor(option.type!)}}>{option.type}</span> {option.description} in <span
                                            style={{color: option.color ?? ''}}>{option.name}</span>

                                        </CommandItem>
                                    )
                                })}
                            </CommandGroup>
                        ) : null}
                    </CommandList>
                </div>
            </div>
        </Command>
    )
}