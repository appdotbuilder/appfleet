<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\Template
 *
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property string $description
 * @property string $docker_image
 * @property string $type
 * @property array|null $environment_variables
 * @property array|null $exposed_ports
 * @property string|null $icon
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Deployment[] $deployments
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Template newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Template newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Template query()
 * @method static \Illuminate\Database\Eloquent\Builder|Template whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Template whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Template whereDockerImage($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Template whereEnvironmentVariables($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Template whereExposedPorts($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Template whereIcon($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Template whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Template whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Template whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Template whereSlug($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Template whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Template whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Template active()
 * @method static \Illuminate\Database\Eloquent\Builder|Template services()
 * @method static \Illuminate\Database\Eloquent\Builder|Template databases()
 * @method static \Database\Factories\TemplateFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Template extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'slug',
        'description',
        'docker_image',
        'type',
        'environment_variables',
        'exposed_ports',
        'icon',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'environment_variables' => 'array',
        'exposed_ports' => 'array',
        'is_active' => 'boolean',
    ];

    /**
     * Get the deployments for the template.
     */
    public function deployments(): HasMany
    {
        return $this->hasMany(Deployment::class);
    }

    /**
     * Scope a query to only include active templates.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to only include service templates.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeServices($query)
    {
        return $query->where('type', 'service');
    }

    /**
     * Scope a query to only include database templates.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeDatabases($query)
    {
        return $query->where('type', 'database');
    }
}