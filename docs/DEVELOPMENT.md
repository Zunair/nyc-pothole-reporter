# Development Guide

## OOP conventions

- Domain entities are classes in `domain/`.
- Repositories expose abstract contract first, implementation second.
- Services encapsulate integrations (geolocation, reverse geocode, photos, API).

## Add a new repository implementation

1. Extend `ComplaintRepository` abstract class.
2. Implement serialization/deserialization for `Complaint` aggregates.
3. Register implementation in app composition root.

## Add new complaint field

1. Add property to `Complaint` domain class.
2. Update repository persistence mappings.
3. Update API DTO/controller validation.
4. Update form UI and copy/export helpers.
5. Add/adjust tests.
