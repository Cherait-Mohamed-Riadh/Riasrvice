// Simple fallback for 3D model - This will create a rotating computer-like shape
const fallbackModel = {
  createComputerModel: function(scene) {
    const group = new THREE.Group();
    
    // Monitor
    const monitorGeometry = new THREE.BoxGeometry(3, 2, 0.2);
    const monitorMaterial = new THREE.MeshPhongMaterial({ color: 0x2d3748 });
    const monitor = new THREE.Mesh(monitorGeometry, monitorMaterial);
    monitor.position.set(0, 1, 0);
    group.add(monitor);
    
    // Screen
    const screenGeometry = new THREE.BoxGeometry(2.8, 1.8, 0.1);
    const screenMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.set(0, 1, 0.11);
    group.add(screen);
    
    // Base
    const baseGeometry = new THREE.CylinderGeometry(0.3, 0.5, 0.5, 8);
    const baseMaterial = new THREE.MeshPhongMaterial({ color: 0x4a5568 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.set(0, -0.25, 0);
    group.add(base);
    
    // Keyboard
    const keyboardGeometry = new THREE.BoxGeometry(2.5, 0.2, 1);
    const keyboardMaterial = new THREE.MeshPhongMaterial({ color: 0x2d3748 });
    const keyboard = new THREE.Mesh(keyboardGeometry, keyboardMaterial);
    keyboard.position.set(0, -0.6, 1.2);
    group.add(keyboard);
    
    // Add orange accent
    const accentGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    const accentMaterial = new THREE.MeshPhongMaterial({ color: 0xf97316 });
    const accent = new THREE.Mesh(accentGeometry, accentMaterial);
    accent.position.set(1.2, 1, 0.2);
    group.add(accent);
    
    group.scale.set(0.6, 0.6, 0.6);
    return group;
  }
};