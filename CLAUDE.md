# Minimal Code Philosophy

## Core Principle

**Write the absolute minimum code necessary to solve the problem. No more, no less.**

## Guidelines

### 1. Reuse Before Creating
- **ALWAYS** check if functionality already exists before creating new code
- Reuse existing components, utilities, and patterns
- Extend existing code rather than duplicating it
- Ask yourself: "Does this already exist in the codebase?"

### 2. No Speculative Code
- Do NOT add features "just in case" they might be needed later
- Do NOT create abstractions until you have 3+ use cases
- Do NOT add configuration options that aren't immediately required
- Implement only what the current requirement explicitly asks for

### 3. Inline Over Extraction
- Keep code inline until there's a clear reason to extract it
- A function/component should only be created when:
  - It's used in 2+ places, OR
  - It significantly improves readability, OR
  - It's explicitly required by the spec/task

### 4. No Unnecessary Abstractions
- Avoid creating wrapper functions that just call another function
- Avoid creating interfaces/types until they're needed by multiple consumers
- Avoid creating "helper" utilities for one-off operations

### 5. Delete Safely
- If code isn't being used and will definitely not be used for future tasks, delete it
- Don't comment out code "for later" - use version control
- Remove unused imports, variables, and functions
- Clean up as you go

### 6. Question Every Line
Before writing any code, ask:
- Is this line absolutely necessary?
- Does this already exist elsewhere?
- Can I achieve this with less code?
- Will removing this break anything?

## Examples

### ❌ BAD - Unnecessary abstraction
```typescript
// Creating a wrapper for a single use case
function handleButtonClick() {
  performAction();
}

<button onClick={handleButtonClick}>Click</button>
```

### ✅ GOOD - Direct and minimal
```typescript
<button onClick={performAction}>Click</button>
```

### ❌ BAD - Speculative features
```typescript
// Adding options that aren't needed yet
interface Config {
  timeout?: number;
  retries?: number;
  cache?: boolean;
  debug?: boolean;
}
```

### ✅ GOOD - Only what's needed
```typescript
// Add options only when they're actually required
interface Config {
  timeout: number;
}
```

### ❌ BAD - Creating new when existing works
```typescript
// Creating a new toast component
function MyCustomToast({ message }) {
  return <div className="toast">{message}</div>;
}
```

### ✅ GOOD - Using existing component
```typescript
// Use the existing SuccessToast component
<SuccessToast 
  title="Success" 
  message={message} 
  onDismiss={handleDismiss} 
/>
```

## When Implementing Tasks

1. **Read the existing code first** - Understand what's already there
2. **Identify reusable pieces** - What can you leverage?
3. **Implement minimally** - Add only what the task requires
4. **Verify necessity** - Could you have done it with less?
5. **Clean up** - Remove any unused code you created during exploration

## Red Flags

If you find yourself doing any of these, stop and reconsider:
- Creating a new component for a single use case
- Adding configuration options "for flexibility"
- Writing helper functions that are only called once
- Creating types/interfaces that only have one consumer
- Adding excess comments explaining what the code does (code should be self-explanatory)
- Creating files with "utils", "helpers", or "common" in the name without clear purpose

## Remember

**The best code is no code. The second best code is code that already exists. Only then should you write new code.**
