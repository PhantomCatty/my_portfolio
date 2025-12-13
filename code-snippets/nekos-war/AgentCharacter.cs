using UnityEngine;
using GameEngineering.Stats;

/// <summary>
/// Example character controller demonstrating how to consume the StatSystem.
/// </summary>
public class AgentCharacter : MonoBehaviour
{
    // Composition over Inheritance
    private StatCalculator _stats;
    
    [Header("Config")]
    [SerializeField] private float _baseHealth = 100f;
    [SerializeField] private float _baseSpeed = 5f;

    void Awake()
    {
        _stats = new StatCalculator();
        
        // Initialize Base Stats
        _stats.SetBaseValue(StatType.MaxHealth, _baseHealth);
        _stats.SetBaseValue(StatType.MoveSpeed, _baseSpeed);
        
        // Event Listener: Only update UI/Logic when stats actually change
        _stats.OnStatChanged += OnStatsUpdated;
    }

    void Start()
    {
        // Simulate sniper ability: +10 Flat Damage
        var sniperBuff = new StatModifier(10f, ModifierType.Flat, this);
        _stats.AddModifier(StatType.AttackDamage, sniperBuff);

        // Simulate an active skill: "Focus" (+50% Speed)
        var focusBuff = new StatModifier(0.5f, ModifierType.PercentAdd, this);
        _stats.AddModifier(StatType.MoveSpeed, focusBuff);
        
        Debug.Log($"Final Speed: {_stats.GetValue(StatType.MoveSpeed)}"); // Should be 7.5
    }

    private void OnStatsUpdated(StatType type)
    {
        if (type == StatType.MoveSpeed)
        {
            // Only update NavMeshAgent when speed actually changes
            // GetComponent<NavMeshAgent>().speed = _stats.GetValue(type);
        }
    }
    
    // Example wrapper property
    public float CurrentHealth => _stats.GetValue(StatType.MaxHealth);
}