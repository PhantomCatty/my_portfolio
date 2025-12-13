/*
 * ======================================================================================
 * PROJECT: 2D Polygon Clipper Tool (Sample 2 of 2)
 * AUTHOR: Zhenming Duan
 * ======================================================================================
 * SYSTEM OVERVIEW:
 * An editor-time tool designed to procedurally slice 2D irregular terrain platforms. This code sample is extracted from my portfolio project 'Sweet Adventure'.
 * It ensures that visual assets (SpriteMask) and physics data (PolygonCollider2D) 
 * remain synchronized after cropping, facilitating modular level design.
 * * ARCHITECTURAL HIGHLIGHTS:
 * 1. Computational Geometry:
 * - Implements the Sutherland-Hodgman algorithm to clip arbitrary polygons against a 
 * bounding box in O(N) time complexity.
 * - Logic is encapsulated in a pure C# static utility class for reusability.
 * * 2. Coordinate Space Transformation:
 * - Solves the complex problem of mapping "World Space" clipping operations back into 
 * the "Local Space" of child objects (Ground Collider), correctly handling relative 
 * offsets, rotations, and scaling matrices using InverseTransformPoint.
 * * 3. Toolsmithing:
 * - Utilizes [ExecuteAlways] and OnValidate to provide real-time WYSIWYG feedback 
 * for level designers within the Unity Editor.
 * ======================================================================================
 */

using System.Collections.Generic;
using UnityEngine;

/* * ============================================
 * PART 1: The Math Library (Pure Logic)
 * ============================================
 */
public static class PolygonMathUtils
{
    /// <summary>
    /// Clips a polygon against an axis-aligned rectangle using the Sutherland-Hodgman algorithm.
    /// </summary>
    /// <param name="polygon">List of vertices representing the polygon.</param>
    /// <param name="clipRect">The bounding box to clip against.</param>
    /// <returns>A new list of vertices inside the clipRect.</returns>
    public static List<Vector2> ClipPolygonByRect(List<Vector2> polygon, Rect clipRect)
    {
        List<Vector2> output = new List<Vector2>(polygon);

        // Clip against all 4 sides of the rectangle
        output = ClipAxis(output, clipRect.xMin, isXAxis: true, keepGreater: true);  // Left
        output = ClipAxis(output, clipRect.xMax, isXAxis: true, keepGreater: false); // Right
        output = ClipAxis(output, clipRect.yMin, isXAxis: false, keepGreater: true); // Bottom
        output = ClipAxis(output, clipRect.yMax, isXAxis: false, keepGreater: false); // Top

        return output;
    }

    // Sutherland-Hodgman axis clipper implementation
    private static List<Vector2> ClipAxis(List<Vector2> points, float clipValue, bool isXAxis, bool keepGreater)
    {
        List<Vector2> newPoints = new List<Vector2>();
        if (points.Count == 0) return newPoints;

        for (int i = 0; i < points.Count; i++)
        {
            Vector2 curr = points[i];
            Vector2 prev = points[(i + points.Count - 1) % points.Count]; // Wrap around

            bool currInside = IsInside(curr, clipValue, isXAxis, keepGreater);
            bool prevInside = IsInside(prev, clipValue, isXAxis, keepGreater);

            if (currInside)
            {
                if (!prevInside)
                {
                    // Case: Entering the visible region -> Add intersection point
                    newPoints.Add(GetIntersection(prev, curr, clipValue, isXAxis));
                }
                // Case: Inside -> Add current point
                newPoints.Add(curr);
            }
            else if (prevInside)
            {
                // Case: Exiting the visible region -> Add intersection point
                newPoints.Add(GetIntersection(prev, curr, clipValue, isXAxis));
            }
        }
        return newPoints;
    }

    private static bool IsInside(Vector2 p, float clipValue, bool isXAxis, bool keepGreater)
    {
        float val = isXAxis ? p.x : p.y;
        return keepGreater ? val >= clipValue : val <= clipValue;
    }

    private static Vector2 GetIntersection(Vector2 p1, Vector2 p2, float clipValue, bool isXAxis)
    {
        // Calculate interpolation factor 't'
        // If clipping X axis: t = (clipX - x1) / (x2 - x1)
        float t = isXAxis 
            ? (clipValue - p1.x) / (p2.x - p1.x) 
            : (clipValue - p1.y) / (p2.y - p1.y);

        // Linear interpolation: P = P1 + t * (P2 - P1)
        return isXAxis 
            ? new Vector2(clipValue, p1.y + t * (p2.y - p1.y)) 
            : new Vector2(p1.x + t * (p2.x - p1.x), clipValue);
    }
}

/* * ============================================
 * PART 2: The Editor Tool (Client Implementation)
 * ============================================
 */
[RequireComponent(typeof(PolygonCollider2D))]
[ExecuteAlways]
public class PolygonCropper : MonoBehaviour
{
    [Header("Crop Settings (Normalized 0-1)")]
    [Range(0, 1)] public float cutLeft = 0f;
    [Range(0, 1)] public float cutRight = 0f;
    [Range(0, 1)] public float cutBottom = 0f;
    [Range(0, 1)] public float cutTop = 0f;

    [Header("References")]
    public SpriteMask visualMask;

    // --- Private Cache ---
    private PolygonCollider2D _polyCollider;
    private SpriteRenderer _spriteRenderer;
    private BoxCollider2D _groundCollider; // Optional child collider for player grounding

    // Cache original data to prevent destructive editing loop
    private Vector2[] _originalPoints;
    private Bounds _originalBounds;
    private Vector2 _groundOriginalSize;
    private Vector2 _groundOriginalOffset;
    
    private bool _isInitialized = false;

    void Start()
    {
        InitializeIfNeeded();
    }

    // Editor-only hook to auto-apply crop when values change in Inspector
    void OnValidate()
    {
        if (gameObject.scene.name != null) 
        {
            #if UNITY_EDITOR
            UnityEditor.EditorApplication.delayCall += () => {
                if(this != null) ApplyCrop();
            };
            #endif
        }
    }

    void InitializeIfNeeded()
    {
        // Prevent re-initialization if data is already cached
        if (_isInitialized && _originalPoints != null && _originalPoints.Length > 0) return;

        _polyCollider = GetComponent<PolygonCollider2D>();
        _spriteRenderer = GetComponent<SpriteRenderer>();

        if (_polyCollider == null) return;

        // 1. Cache Polygon Data
        _originalPoints = _polyCollider.GetPath(0);

        // 2. Cache Bounds Data
        if (_spriteRenderer != null)
        {
            _originalBounds = _spriteRenderer.sprite.bounds;
        }
        else
        {
            // Fallback if no sprite renderer
            Bounds worldBounds = _polyCollider.bounds;
            Vector3 localSize = transform.InverseTransformVector(worldBounds.size);
            _originalBounds = new Bounds(Vector3.zero, localSize);
        }

        // 3. Cache "Ground" Child Data (if exists)
        if (transform.parent != null)
        {
            Transform groundTrans = transform.parent.Find("Ground");
            if (groundTrans != null)
            {
                _groundCollider = groundTrans.GetComponent<BoxCollider2D>();
                if (_groundCollider != null)
                {
                    _groundOriginalSize = _groundCollider.size;
                    _groundOriginalOffset = _groundCollider.offset;
                }
            }
        }

        _isInitialized = true;
    }

    /// <summary>
    /// The main entry point for the cropping logic.
    /// Recalculates Physics (Polygon & Box) and Visuals (Mask).
    /// </summary>
    public void ApplyCrop()
    {
        InitializeIfNeeded(); 
        if (_originalPoints == null || _originalPoints.Length == 0) return;

        // Step 1: Calculate the Clipping Rectangle in Local Space
        float minX = _originalBounds.min.x + (_originalBounds.size.x * cutLeft);
        float maxX = _originalBounds.max.x - (_originalBounds.size.x * cutRight);
        float minY = _originalBounds.min.y + (_originalBounds.size.y * cutBottom);
        float maxY = _originalBounds.max.y - (_originalBounds.size.y * cutTop);

        // Validation: If cropped entirely, disable everything
        if (minX >= maxX - 0.001f || minY >= maxY - 0.001f)
        {
            _polyCollider.pathCount = 0;
            if (visualMask) visualMask.gameObject.SetActive(false);
            if (_groundCollider) _groundCollider.enabled = false;
            return;
        }
        
        if (visualMask) visualMask.gameObject.SetActive(true);
        if (_groundCollider) _groundCollider.enabled = true;

        Rect clipRect = Rect.MinMaxRect(minX, minY, maxX, maxY);

        // Step 2: Process PolygonCollider (Physics) using Math Utility
        // This is where the Computational Geometry happens
        List<Vector2> newPath = PolygonMathUtils.ClipPolygonByRect(new List<Vector2>(_originalPoints), clipRect);
        
        _polyCollider.pathCount = 1;
        _polyCollider.SetPath(0, newPath.ToArray());

        // Step 3: Process Ground Collider (Child Object)
        if (_groundCollider != null)
        {
            UpdateGroundCollider(clipRect);
        }

        // Step 4: Process Visual Mask
        if (visualMask != null && visualMask.sprite != null)
        {
            UpdateVisualMask(clipRect);
        }
    }

    /// <summary>
    /// Handles the complex logic of mapping the Parent's crop rect 
    /// into the Child's (Ground) local coordinate space.
    /// </summary>
    void UpdateGroundCollider(Rect platformClipRect)
    {
        Transform groundTrans = _groundCollider.transform;

        // A. Transform the Crop Rect corners from Platform Local Space -> World Space
        Vector3 worldMin = transform.TransformPoint(platformClipRect.min);
        Vector3 worldMax = transform.TransformPoint(platformClipRect.max);

        // B. Transform from World Space -> Ground Local Space
        // This handles relative rotation/scaling between Parent and Child
        Vector3 groundLocalP1 = groundTrans.InverseTransformPoint(worldMin);
        Vector3 groundLocalP2 = groundTrans.InverseTransformPoint(worldMax);

        // Reconstruct Rect in Ground Space (Min/Max might flip due to negative scale or rotation)
        Rect allowedRectInGround = Rect.MinMaxRect(
            Mathf.Min(groundLocalP1.x, groundLocalP2.x),
            Mathf.Min(groundLocalP1.y, groundLocalP2.y),
            Mathf.Max(groundLocalP1.x, groundLocalP2.x),
            Mathf.Max(groundLocalP1.y, groundLocalP2.y)
        );

        // C. Calculate Intersection (AABB Collision)
        // Original Ground Rect (based on initial offset/size)
        Vector2 originalMin = _groundOriginalOffset - _groundOriginalSize * 0.5f;
        Rect originalGroundRect = new Rect(originalMin, _groundOriginalSize);

        // Intersection Logic
        float newXMin = Mathf.Max(originalGroundRect.xMin, allowedRectInGround.xMin);
        float newXMax = Mathf.Min(originalGroundRect.xMax, allowedRectInGround.xMax);
        float newYMin = Mathf.Max(originalGroundRect.yMin, allowedRectInGround.yMin);
        float newYMax = Mathf.Min(originalGroundRect.yMax, allowedRectInGround.yMax);

        // D. Apply Intersection Result
        if (newXMin < newXMax && newYMin < newYMax)
        {
            _groundCollider.enabled = true;
            float newWidth = newXMax - newXMin;
            float newHeight = newYMax - newYMin;
            
            _groundCollider.size = new Vector2(newWidth, newHeight);
            _groundCollider.offset = new Vector2(newXMin + newWidth * 0.5f, newYMin + newHeight * 0.5f);
        }
        else
        {
            // Intersection is empty (Crop area is outside Ground area)
            _groundCollider.enabled = false;
        }
    }

    void UpdateVisualMask(Rect clipRect)
    {
        Sprite maskSprite = visualMask.sprite;
        Vector3 maskRawSize = maskSprite.bounds.size;
        
        if (maskRawSize.x <= 0.0001f || maskRawSize.y <= 0.0001f) return;

        // Align rotation
        visualMask.transform.rotation = transform.rotation;

        // Calculate Scale
        float finalScaleX = (clipRect.width / maskRawSize.x) * transform.localScale.x;
        float finalScaleY = (clipRect.height / maskRawSize.y) * transform.localScale.y;
        visualMask.transform.localScale = new Vector3(finalScaleX, finalScaleY, 1);

        // Calculate Position
        // Must account for the mask sprite's pivot offset in World Space
        Vector3 targetWorldCenter = transform.TransformPoint(clipRect.center);
        Vector3 maskCenterWorldOffset = visualMask.transform.TransformVector(maskSprite.bounds.center);
        visualMask.transform.position = targetWorldCenter - maskCenterWorldOffset;
    }

    // Editor Gizmos for visual debugging
    private void OnDrawGizmosSelected()
    {
        if (_spriteRenderer == null || _spriteRenderer.sprite == null) return;
        
        // Re-calculate rect for visualization
        Bounds b = _spriteRenderer.sprite.bounds;
        float minX = b.min.x + (b.size.x * cutLeft);
        float maxX = b.max.x - (b.size.x * cutRight);
        float minY = b.min.y + (b.size.y * cutBottom);
        float maxY = b.max.y - (b.size.y * cutTop);

        if (minX < maxX && minY < maxY) {
            Gizmos.matrix = transform.localToWorldMatrix;
            Rect r = Rect.MinMaxRect(minX, minY, maxX, maxY);
            Gizmos.color = Color.green;
            Gizmos.DrawWireCube(r.center, r.size);
        }
    }
}