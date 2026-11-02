<?php

namespace App\Http\Requests;

use App\Models\Lead;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreLeadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->filled('phone')) {
            $this->merge(['phone' => preg_replace('/[\s\-().]/', '', $this->input('phone'))]);
        }
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $isCallback = $this->input('type') === Lead::TYPE_CALLBACK;

        return [
            'type' => ['required', Rule::in([Lead::TYPE_CALLBACK, Lead::TYPE_WAITLIST])],
            'service_id' => [Rule::requiredIf(! $isCallback), 'nullable', 'integer', 'exists:services,id'],
            'tariff_id' => ['nullable', 'integer', 'exists:tariffs,id'],
            'name' => [Rule::requiredIf($isCallback), 'nullable', 'string', 'max:120'],
            'phone' => [Rule::requiredIf($isCallback), 'nullable', 'regex:/^(\+34|0034)?[6789]\d{8}$/'],
            'email' => [Rule::requiredIf(! $isCallback), 'nullable', 'email', 'max:180'],
            'postal_code' => ['nullable', 'regex:/^\d{5}$/'],
            'preferred_time' => ['nullable', Rule::in(['morning', 'afternoon', 'anytime'])],
            'message' => ['nullable', 'string', 'max:1000'],
            'consent' => ['accepted'],
            'source' => ['nullable', 'string', 'max:120'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Dinos tu nombre.',
            'phone.required' => 'Necesitamos un teléfono para llamarte.',
            'phone.regex' => 'Introduce un teléfono español válido (9 dígitos).',
            'email.required' => 'Introduce tu email.',
            'email.email' => 'Ese email no parece válido.',
            'postal_code.regex' => 'El código postal tiene 5 dígitos.',
            'consent.accepted' => 'Debes aceptar la política de privacidad.',
        ];
    }
}
