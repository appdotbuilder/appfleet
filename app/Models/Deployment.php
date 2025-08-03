<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\Deployment
 *
 * @property int $id
 * @property int $user_id
 * @property int $template_id
 * @property int $plan_id
 * @property int $server_id
 * @property string $name
 * @property string|null $container_id
 * @property string $status
 * @property array|null $environment_variables
 * @property array|null $port_mappings
 * @property string|null $custom_domain
 * @property string|null $connection_info
 * @property \Illuminate\Support\Carbon|null $deployed_at
 * @property \Illuminate\Support\Carbon|null $last_accessed_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * @property-read \App\Models\Template $template
 * @property-read \App\Models\Plan $plan
 * @property-read \App\Models\Server $server
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Deployment newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Deployment newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Deployment query()
 * @method static \Illuminate\Database\Eloquent\Builder|Deployment whereConnectionInfo($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Deployment whereContainerId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Deployment whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Deployment whereCustomDomain($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Deployment whereDeployedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Deployment whereEnvironmentVariables($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Deployment whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Deployment whereLastAccessedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Deployment whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Deployment wherePlanId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Deployment wherePortMappings($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Deployment whereServerId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Deployment whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Deployment whereTemplateId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Deployment whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Deployment whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Deployment running()
 * @method static \Database\Factories\DeploymentFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Deployment extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'template_id',
        'plan_id',
        'server_id',
        'name',
        'container_id',
        'status',
        'environment_variables',
        'port_mappings',
        'custom_domain',
        'connection_info',
        'deployed_at',
        'last_accessed_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'environment_variables' => 'array',
        'port_mappings' => 'array',
        'deployed_at' => 'datetime',
        'last_accessed_at' => 'datetime',
    ];

    /**
     * Get the user that owns the deployment.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the template for the deployment.
     */
    public function template(): BelongsTo
    {
        return $this->belongsTo(Template::class);
    }

    /**
     * Get the plan for the deployment.
     */
    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

    /**
     * Get the server for the deployment.
     */
    public function server(): BelongsTo
    {
        return $this->belongsTo(Server::class);
    }

    /**
     * Scope a query to only include running deployments.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeRunning($query)
    {
        return $query->where('status', 'running');
    }
}