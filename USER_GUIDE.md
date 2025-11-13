# FuelEU Maritime Compliance System - User Guide

## Overview
This system helps you monitor and manage maritime fuel compliance under EU Regulation 2023/1805 (FuelEU Maritime).

## Color Scheme
- **Primary**: Teal/Emerald (representing maritime/environmental themes)
- **Success**: Green (compliant, positive actions)
- **Warning**: Red (non-compliant, errors)
- **Neutral**: Gray (informational)

## Navigation

### Main Tabs
1. **Routes** (▶): View and manage maritime routes
2. **Compare** (⚖): Compare route emissions against baselines
3. **Banking** (◉): Manage compliance balance banking
4. **Pooling** (◈): Create and manage pooling agreements

## Tab-by-Tab Guide

### 1. Routes Tab
**Purpose**: Manage your fleet's maritime routes and set baseline standards.

**How to Use**:
1. Use the filter dropdown menus to find specific routes
2. View route details including GHG intensity, fuel consumption, and emissions
3. Click "Set Baseline" to designate a route as your compliance standard
4. Only one baseline can be active at a time

**Key Terms**:
- **GHG Intensity**: Greenhouse gas emissions measured in grams CO₂ equivalent per megajoule
- **Baseline**: The reference standard used for compliance comparison

### 2. Compare Tab
**Purpose**: Analyze compliance by comparing routes against baseline values.

**How to Use**:
1. View the statistics cards showing:
   - Total routes analyzed
   - Number of compliant routes
   - Overall compliance rate
2. Review the chart for visual comparison
3. Check the detailed table for individual route compliance status

**Understanding Results**:
- **Compliant** (✓): Route meets or exceeds target requirements
- **Non-Compliant** (✗): Route exceeds allowed emissions
- **Negative %**: Better performance than baseline (improvement)
- **Positive %**: Worse performance than baseline

### 3. Banking Tab
**Purpose**: Bank surplus compliance balance or apply banked balance to offset deficits.

**Step-by-Step Process**:
1. Enter Ship ID (required)
2. Enter Reporting Year (required)
3. Click "Load Compliance Balance" to check current status
4. Enter the amount you want to bank or apply
5. Choose action:
   - **Bank Surplus**: Store positive balance (valid for 3 years)
   - **Apply Banked Surplus**: Use stored balance to offset deficit

**Important Rules**:
- Can only bank positive (surplus) balance
- Banked balance is valid for maximum 3 years
- Must load compliance balance before performing actions

### 4. Pooling Tab
**Purpose**: Create pooling agreements to share compliance balance across multiple ships.

**Step-by-Step Process**:
1. Select the Pool Year
2. Add at least 2 pool members:
   - Enter Ship ID for each member
   - Enter their current Compliance Balance
3. Review the total pool balance
4. Click "Create Pooling Agreement" when ready

**Requirements**:
- Minimum 2 members required
- Total pool balance must be non-negative (≥ 0)
- Each ship ID must be unique
- Balance is redistributed equally among all members

**After Creation**:
- View results showing each member's balance before and after
- See which ships gained balance and which contributed

## Accessibility Features

### Keyboard Navigation
- Use **Tab** to move between interactive elements
- Use **Enter** or **Space** to activate buttons
- Use **Arrow keys** in dropdown menus
- Use **Escape** to close dialogs

### Screen Reader Support
- All buttons have descriptive labels
- Tables include proper headers and structure
- Form fields have associated labels
- Status messages announced automatically
- Abbreviations expanded with full text

### Visual Accessibility
- High contrast colors for better readability
- Large, clear fonts
- Hover tooltips for additional guidance
- Focus indicators for keyboard navigation
- Color is not the only indicator (text labels included)

## Tips for Best Results

1. **Start with Routes**: Set up your routes and baseline first
2. **Check Compliance**: Use Compare tab to see your compliance status
3. **Manage Balance**: Use Banking or Pooling to optimize compliance
4. **Regular Updates**: Refresh data regularly for accurate information
5. **Read Help Sections**: Each tab includes context-specific help

## Common Questions

**Q: What if I can't create a pool?**
A: Ensure total pool balance is non-negative and you have at least 2 members.

**Q: How long can I bank surplus?**
A: Banked surplus is valid for up to 3 years under Article 20.

**Q: Can I have multiple baselines?**
A: No, only one route can be set as baseline at a time.

**Q: What does "gCO₂eq" mean?**
A: Grams of CO₂ equivalent - a standard measure for greenhouse gas emissions.

## Technical Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- Internet connection for data loading
- Minimum screen resolution: 1024x768

## Support

For technical issues or questions:
- Check the help sections in each tab
- Hover over elements for tooltips
- Review this user guide
- Contact your system administrator

## Compliance Information

This system implements:
- EU Regulation 2023/1805 (FuelEU Maritime)
- Article 20: Banking of surplus compliance balance
- Article 21: Pooling of compliance balances
- GHG intensity calculations per EU standards
