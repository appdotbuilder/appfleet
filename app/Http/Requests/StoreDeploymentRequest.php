<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDeploymentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'template_id' => 'required|exists:templates,id',
            'plan_id' => 'required|exists:plans,id',
            'name' => 'required|string|max:255|regex:/^[a-zA-Z0-9-_]+$/',
            'custom_domain' => 'nullable|string|max:255|regex:/^[a-zA-Z0-9.-]+$/',
            'environment_variables' => 'nullable|array',
            'environment_variables.*' => 'string',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Deployment name is required.',
            'name.regex' => 'Deployment name can only contain letters, numbers, hyphens, and underscores.',
            'template_id.required' => 'Please select a template.',
            'template_id.exists' => 'The selected template is invalid.',
            'plan_id.required' => 'Please select a plan.',
            'plan_id.exists' => 'The selected plan is invalid.',
            'custom_domain.regex' => 'Please enter a valid domain name.',
        ];
    }
}