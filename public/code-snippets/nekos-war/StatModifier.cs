using System;
using System.Collections.Generic;
using UnityEngine;

// Separation of stat types. 
// All calculatable item can be combined with StatType + ModifierType.
public enum StatType
{
    AttackDamage,
    MagicAttackDamage,
    MoveSpeed,
    AttackSpeed,
    Armor,
    MagicArmor,
    ArmorPenetration,
    MagicPenetration,
    Resistance,
    MagicResistance,
    MaxHealth,
    Range,
    FinalDamage
}

// Defines how the math operates.
// Order of operations: Flat -> PercentAdd -> PercentMult
public enum ModifierType
{
    Flat = 100,          // Direct addition (e.g., +10 Damage)
    PercentAdd = 200,    // Additive percentage (e.g., +10% STR)
    PercentMult = 300    // Multiplicative percentage (e.g., x1.5 Final Damage)
}

/// <summary>
/// A standalone object representing a modification to a stat.
/// Uses "Source" object to track origin (e.g., a specific Buff instance or Equipment).
/// </summary>
[Serializable]
public class StatModifier
{
    public readonly float Value;
    public readonly ModifierType Type;
    public readonly int Order;
    public readonly object Source; // Key for removing specific buffs

    public StatModifier(float value, ModifierType type, int order, object source)
    {
        Value = value;
        Type = type;
        Order = order;
        Source = source;
    }

    public StatModifier(float value, ModifierType type) : this(value, type, (int)type, null) { }
}
