# Methodology: Mathematical Modeling for Hick-Hyman Law Simulation

## 3.1 Mathematical Modeling

This section outlines the mathematical framework for a simulation modeling reaction time (RT) in a flat menu interface with 4 to 10 buttons, using Hick-Hyman Law. The simulation calibrates the base reaction time (**a**) via single-button trials, applies the law, and adds Gaussian noise for realism.

### 3.1.1 Model Description
The simulation predicts RT for selecting a highlighted button from a flat menu with \( n \) buttons (4–10), using:

\[
RT = a + b \cdot \log_2(n)
\]

- \( RT \): Reaction time (ms).
- \( a \): Base reaction time (ms), calibrated.
- \( b \): Slope (ms/bit), set to 150.
- \( n \): Number of buttons.
- \( \log_2(n) \): Decision complexity.

Gaussian noise (\( \sigma = 30 \, \text{ms} \)) is added to simulate variability. The process includes calibration (3 single-button trials), main simulation (5 rounds per button count), and output (table, chart).

### 3.1.2 Assumptions
1. Hick-Hyman Law applies (Hick, 1952; Hyman, 1953).
2. Buttons are visually uniform (Card et al., 1978).
3. RT variability is Gaussian, \( \sigma = 30 \, \text{ms} \) (Wagenmakers & Brown, 2007).
4. \( b = 150 \, \text{ms/bit} \) is constant (Seow, 2008).
5. Single-button trials estimate **a** (Card et al., 1978).
6. User performance is stable.

### 3.1.3 Constraints
1. Button range: 4–10.
2. Task: Single button click.
3. Calibration: 3 trials.
4. Noise: \( \sigma = 30 \, \text{ms} \).
5. Browser-based RT measurement.

### 3.1.4 Simplifications
1. Fixed \( b = 150 \, \text{ms/bit} \).
2. Gaussian noise, \( \sigma = 30 \, \text{ms} \).
3. No learning effects.
4. General user population.
5. Single-button calibration.

### 3.1.5 Mathematical Formulation
1. Hick-Hyman Law:
   \[
   RT_{\text{predicted}} = a + b \cdot \log_2(n)
   \]
2. Calibration:
   \[
   a = \frac{1}{k} \sum_{i=1}^k RT_i, \quad k = 3
   \]
3. Noise:
   \[
   \text{noise} = Z \cdot \sigma, \quad Z \sim \mathcal{N}(0, 1), \quad \sigma = 30 \, \text{ms}
   \]
4. Final RT:
   \[
   RT_{\text{final}} = \max(0, RT_{\text{predicted}} + \text{noise})
   \]
5. Average Measured RT:
   \[
   RT_{\text{avg}} = \frac{1}{m} \sum_{j=1}^m RT_j, \quad m = 5
   \]

### 3.1.6 Simulation Process
See flowchart (artifact ID: `96c08949-5067-4b0a-9c7f-b04aa80cfbc6`).

### 3.1.7 Justification of Methods
- Hick-Hyman Law: Hick (1952), Seow (2008).
- Calibration: Card et al. (1978).
- Noise (\( \sigma = 30 \, \text{ms} \)): Wagenmakers & Brown (2007), MacKenzie & Zhang (2001).
- \( b = 150 \, \text{ms/bit} \): Seow (2008).
- 5 rounds: MacKenzie & Zhang (2001).
- Uniform buttons: Card et al. (1978).

### 3.1.8 Visualizations
1. **Block Diagram**: Input → Calibration → Hick-Hyman Model → Noise Generator → Output.
2. **Flowchart**: Artifact ID `96c08949-5067-4b0a-9c7f-b04aa80cfbc6`.
3. **Equations**: LaTeX-formatted above.

### 3.1.9 Alignment with Case Study
- **Control for Visual Attributes**: Uniform buttons (Card et al., 1978).
- **Flat Reaction Time**: Accurate RTs (Seow, 2008).
- **Objectives**: Validates law, ensures consistency, quantifies variability, evaluates efficiency, reusable.

### References
- Card, S. K., et al. (1978). *Ergonomics, 21*(8), 601–613.
- Hick, W. E. (1952). *Quarterly Journal of Experimental Psychology, 4*(1), 11–26.
- Hyman, R. (1953). *Journal of Experimental Psychology, 45*(3), 188–196.
- MacKenzie, I. S., & Zhang, S. X. (2001). *Graphics Interface 2001*, 129–137.
- Seow, S. C. (2008). *Designing and Engineering Time*.
- Wagenmakers, E.-J., & Brown, S. (2007). *Psychological Review, 114*(3), 830–841.