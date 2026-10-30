# LEAF verification report

Execution target: Lens Studio Interactive Preview, SPECS 27  
Verification date: 2026-10-30

| Done criterion | Scenario | Result |
|---|---|---|
| Building stand-in and reachable cluster marker | `street_property_criterion_1_building` | PASS |
| Overlay visibility based on view/distance | `street_property_criterion_2_visibility` | PASS |
| Three floor markers scatter from cluster | `street_property_criterion_3_scatter` | PASS |
| Listing card, connector, and property data | `street_property_criterion_4_listing` | PASS |
| Close card while preserving floor markers | `street_property_criterion_5_close` | PASS |

Logic proven: the complete Preview flow, state transitions, displayed listing data, visibility behavior, and interaction callbacks.

Feel unproven: comfort over time, real hand tracking, real building recognition, live listing data, and physical façade alignment on Specs hardware.
