import numpy as np
import matplotlib.pyplot as plt
from scipy import stats
# Set random seed for reproducibility
np.random.seed(42)
def simulate_random_process(t_points, num_samples, omega=1):
    # Generate random theta values uniformly distributed in [-π/2, π/2]
    theta_samples = np.random.uniform(-np.pi/2, np.pi/2, num_samples)
    # Initialize array to store process values
    X = np.zeros((num_samples, len(t_points)))
   # Calculate X(t) for each theta and time point
    for i in range(num_samples):
        X[i, :] = np.cos(omega * t_points + theta_samples[i])
    return X, theta_samples
# Simulation parameters
t_points = np.linspace(0, 10, 1000)  # Time points
num_samples = 1000                    # Number of sample paths
omega = 2*np.pi                       # Angular frequency
# Perform simulation
X, theta_samples = simulate_random_process(t_points, num_samples, omega)
# Calculate mean and variance
mean_X = np.mean(X, axis=0)
var_X = np.var(X, axis=0)
# Plotting
plt.figure(figsize=(15, 10))
# Plot 1: Sample paths
plt.subplot(3, 1, 1)
for i in range(5):  # Plot first 5 sample paths
    plt.plot(t_points, X[i, :], alpha=0.5, label=f'Sample path {i+1}')
plt.title('Sample Paths of Random Process X(t)')
plt.xlabel('t')
plt.ylabel('X(t)')
plt.legend()
plt.grid(True)
# Plot 2: Mean
plt.subplot(3, 1, 2)
plt.plot(t_points, mean_X, 'r-', label='Mean')
plt.title('Mean of Random Process')
plt.xlabel('t')
plt.ylabel('E[X(t)]')
plt.legend()
plt.grid(True)
# Plot 3: Variance
plt.subplot(3, 1, 3)
plt.plot(t_points, var_X, 'g-', label='Variance')
plt.title('Variance of Random Process')
plt.xlabel('t')
plt.ylabel('Var[X(t)]')
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.show()
# Print theoretical analysis
print("\nTheoretical Analysis:")
print("---------------------")
print("1. Mean Analysis:")
print(f"Mean range: [{np.min(mean_X):.6f}, {np.max(mean_X):.6f}]")
print("\n2. Variance Analysis:")
print(f"Variance range: [{np.min(var_X):.6f}, {np.max(var_X):.6f}]")
# Check if process is approximately time-independent
mean_variation = np.max(mean_X) - np.min(mean_X)
var_variation = np.max(var_X) - np.min(var_X)
print("\nTime-Dependence Analysis:")
print("-------------------------")
print(f"Mean variation across time: {mean_variation:.6f}")
print(f"Variance variation across time: {var_variation:.6f}")
if mean_variation < 0.1 and var_variation < 0.1:
    print("\nConclusion: The process appears to be approximately time-independent")
else:
    print("\nConclusion: The process shows time-dependent behavior")
import numpy as np
import matplotlib.pyplot as plt
from scipy import stats
# Set random seed for reproducibility
np.random.seed(42)
def simulate_random_process(t_points, num_samples, omega=1):
    # Generate random theta values uniformly distributed in [-π/2, π/2]
    theta_samples = np.random.uniform(-np.pi/2, np.pi/2, num_samples)
    # Initialize array to store process values
    X = np.zeros((num_samples, len(t_points)))
   # Calculate X(t) for each theta and time point
    for i in range(num_samples):
        X[i, :] = np.cos(omega * t_points + theta_samples[i])
    return X, theta_samples
# Simulation parameters
t_points = np.linspace(0, 10, 1000)  # Time points
num_samples = 1000                    # Number of sample paths
omega = 2*np.pi                       # Angular frequency
# Perform simulation
X, theta_samples = simulate_random_process(t_points, num_samples, omega)
# Calculate mean and variance
mean_X = np.mean(X, axis=0)
var_X = np.var(X, axis=0)
# Plotting
plt.figure(figsize=(15, 10))
# Plot 1: Sample paths
plt.subplot(3, 1, 1)
for i in range(5):  # Plot first 5 sample paths
    plt.plot(t_points, X[i, :], alpha=0.5, label=f'Sample path {i+1}')
plt.title('Sample Paths of Random Process X(t)')
plt.xlabel('t')
plt.ylabel('X(t)')
plt.legend()
plt.grid(True)
# Plot 2: Mean
plt.subplot(3, 1, 2)
plt.plot(t_points, mean_X, 'r-', label='Mean')
plt.title('Mean of Random Process')
plt.xlabel('t')
plt.ylabel('E[X(t)]')
plt.legend()
plt.grid(True)
# Plot 3: Variance
plt.subplot(3, 1, 3)
plt.plot(t_points, var_X, 'g-', label='Variance')
plt.title('Variance of Random Process')
plt.xlabel('t')
plt.ylabel('Var[X(t)]')
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.show()
# Print theoretical analysis
print("\nTheoretical Analysis:")
print("---------------------")
print("1. Mean Analysis:")
print(f"Mean range: [{np.min(mean_X):.6f}, {np.max(mean_X):.6f}]")
print("\n2. Variance Analysis:")
print(f"Variance range: [{np.min(var_X):.6f}, {np.max(var_X):.6f}]")
# Check if process is approximately time-independent
mean_variation = np.max(mean_X) - np.min(mean_X)
var_variation = np.max(var_X) - np.min(var_X)
print("\nTime-Dependence Analysis:")
print("-------------------------")
print(f"Mean variation across time: {mean_variation:.6f}")
print(f"Variance variation across time: {var_variation:.6f}")
if mean_variation < 0.1 and var_variation < 0.1:
    print("\nConclusion: The process appears to be approximately time-independent")
else:
    print("\nConclusion: The process shows time-dependent behavior")
import numpy as np
import matplotlib.pyplot as plt
from scipy import stats
# Set random seed for reproducibility
np.random.seed(42)
def simulate_random_process(t_points, num_samples, omega=1):
    # Generate random theta values uniformly distributed in [-π/2, π/2]
    theta_samples = np.random.uniform(-np.pi/2, np.pi/2, num_samples)
    # Initialize array to store process values
    X = np.zeros((num_samples, len(t_points)))
   # Calculate X(t) for each theta and time point
    for i in range(num_samples):
        X[i, :] = np.cos(omega * t_points + theta_samples[i])
    return X, theta_samples
# Simulation parameters
t_points = np.linspace(0, 10, 1000)  # Time points
num_samples = 1000                    # Number of sample paths
omega = 2*np.pi                       # Angular frequency
# Perform simulation
X, theta_samples = simulate_random_process(t_points, num_samples, omega)
# Calculate mean and variance
mean_X = np.mean(X, axis=0)
var_X = np.var(X, axis=0)
# Plotting
plt.figure(figsize=(15, 10))
# Plot 1: Sample paths
plt.subplot(3, 1, 1)
for i in range(5):  # Plot first 5 sample paths
    plt.plot(t_points, X[i, :], alpha=0.5, label=f'Sample path {i+1}')
plt.title('Sample Paths of Random Process X(t)')
plt.xlabel('t')
plt.ylabel('X(t)')
plt.legend()
plt.grid(True)
# Plot 2: Mean
plt.subplot(3, 1, 2)
plt.plot(t_points, mean_X, 'r-', label='Mean')
plt.title('Mean of Random Process')
plt.xlabel('t')
plt.ylabel('E[X(t)]')
plt.legend()
plt.grid(True)
# Plot 3: Variance
plt.subplot(3, 1, 3)
plt.plot(t_points, var_X, 'g-', label='Variance')
plt.title('Variance of Random Process')
plt.xlabel('t')
plt.ylabel('Var[X(t)]')
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.show()
# Print theoretical analysis
print("\nTheoretical Analysis:")
print("---------------------")
print("1. Mean Analysis:")
print(f"Mean range: [{np.min(mean_X):.6f}, {np.max(mean_X):.6f}]")
print("\n2. Variance Analysis:")
print(f"Variance range: [{np.min(var_X):.6f}, {np.max(var_X):.6f}]")
# Check if process is approximately time-independent
mean_variation = np.max(mean_X) - np.min(mean_X)
var_variation = np.max(var_X) - np.min(var_X)
print("\nTime-Dependence Analysis:")
print("-------------------------")
print(f"Mean variation across time: {mean_variation:.6f}")
print(f"Variance variation across time: {var_variation:.6f}")
if mean_variation < 0.1 and var_variation < 0.1:
    print("\nConclusion: The process appears to be approximately time-independent")
else:
    print("\nConclusion: The process shows time-dependent behavior")
