/*
 * ======================================================================================
 * PROJECT: Modular Stat System (Core Logic)
 * AUTHOR: Zhenming Duan
 * ======================================================================================
 * SYSTEM OVERVIEW:
 * The core logic engine for a generic, data-driven RTS attribute system. This code sample is extracted from my portfolio project 'Nekos War'.
 * * ARCHITECTURAL HIGHLIGHTS:
 * 1. Dirty Flag Optimization: 
 * - Implements a caching mechanism (_cachedValues + _isDirty).
 * - Recalculates stats ONLY when requested AND modified, reducing complexity 
 * from O(N) per frame to O(1) for stable stats.
 * 2. Separation of Concerns (SoC):
 * - Pure C# logic, decoupled from Unity's MonoBehaviour/GameObject lifecycle.
 * - Uses C# Events to notify external systems (UI/Animation) only on value changes.
 * 3. Generic Pipeline:
 * - Supports standard RPG formula. For example: Final Damage = (Base + Flat) * (1 + %Add) * (1 + %Mult).
 * ======================================================================================
 */

public class StatCalculator
{
    // Stores all raw modifiers per stat
    private readonly Dictionary<StatType, List<StatModifier>> _statModifiers;

    // Caches the most recent calculation result
    private readonly Dictionary<StatType, float> _cachedValues;

    // Tracks validity of the cache. True = Cache is stale, needs recalc.
    private readonly Dictionary<StatType, bool> _isDirty;

    // Base values (e.g., naked stats without items)
    private readonly Dictionary<StatType, float> _baseValues;

    public event Action<StatType> OnStatChanged;

    public StatCalculator()
    {
        _statModifiers = new Dictionary<StatType, List<StatModifier>>();
        _cachedValues = new Dictionary<StatType, float>();
        _isDirty = new Dictionary<StatType, bool>();
        _baseValues = new Dictionary<StatType, float>();
    }

    public void SetBaseValue(StatType type, float value)
    {
        _baseValues[type] = value;
        _isDirty[type] = true;
        OnStatChanged?.Invoke(type);
    }

    /// <summary>
    /// Retrieves the final calculated value. 
    /// Triggers a recalculation only if the Dirty Flag is set.
    /// </summary>
    public float GetValue(StatType type)
    {
        if (!_baseValues.ContainsKey(type)) return 0f;

        // Optimization: Return cached value if clean
        if (_isDirty.ContainsKey(type) && !_isDirty[type])
        {
            return _cachedValues[type];
        }

        // Heavy lifting: Recalculate
        float finalValue = CalculateFinalValue(type, _baseValues[type]);

        // Update cache and clear flag
        _cachedValues[type] = finalValue;
        _isDirty[type] = false;

        return finalValue;
    }

    public void AddModifier(StatType type, StatModifier mod)
    {
        if (!_statModifiers.ContainsKey(type))
        {
            _statModifiers[type] = new List<StatModifier>();
        }

        _statModifiers[type].Add(mod);
        _statModifiers[type].Sort(CompareModifierOrder); // Maintain sort order for deterministic calc

        _isDirty[type] = true; // Mark as dirty
        OnStatChanged?.Invoke(type);
    }

    public bool RemoveAllModifiersFromSource(object source)
    {
        bool didRemove = false;

        foreach (var key in _statModifiers.Keys)
        {
            int numRemoved = _statModifiers[key].RemoveAll(mod => mod.Source == source);
            if (numRemoved > 0)
            {
                _isDirty[key] = true;
                didRemove = true;
                OnStatChanged?.Invoke(key);
            }
        }
        return didRemove;
    }

    // Calculation Formula
    private float CalculateFinalValue(StatType type, float baseValue)
    {
        if (!_statModifiers.ContainsKey(type)) return baseValue;

        float finalValue = baseValue;
        float sumPercentAdd = 0f;

        foreach (var mod in _statModifiers[type])
        {
            if (mod.Type == ModifierType.Flat)
            {
                finalValue += mod.Value;
            }
            else if (mod.Type == ModifierType.PercentAdd)
            {
                sumPercentAdd += mod.Value; // Accumulate (e.g., 10% + 20% = 30%)
            }
            else if (mod.Type == ModifierType.PercentMult)
            {
                // Multipliers are applied at the end (e.g., Double Damage Rune)
                // I calculate them here but could be deferred depending on game rules
                continue;
            }
        }

        // Apply Sum Percent
        finalValue *= (1 + sumPercentAdd);

        // Apply Final Multipliers (Iterate again or do it in one pass if sorted correctly)
        foreach (var mod in _statModifiers[type])
        {
            if (mod.Type == ModifierType.PercentMult)
            {
                finalValue *= (1 + mod.Value);
            }
        }

        return (float)Math.Round(finalValue, 4); // Precision handling
    }

    private int CompareModifierOrder(StatModifier a, StatModifier b)
    {
        if (a.Order < b.Order) return -1;
        if (a.Order > b.Order) return 1;
        return 0;
    }
}
