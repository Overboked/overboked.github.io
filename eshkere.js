export function loadModel(container, modelPath, backgroundImagePath) {
    const scene = new THREE.Scene();

    // Adjust the near and far clipping planes
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.01, 1000);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Load and rotate the HDR background image
    const hdriLoader = new THREE.RGBELoader();
    hdriLoader.load(backgroundImagePath, function (texture) {
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        pmremGenerator.dispose();
        texture.dispose();

        scene.environment = envMap;
        scene.background = envMap;
    });

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    const dracoLoader = new THREE.DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

    const gltfLoader = new THREE.GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    gltfLoader.load(modelPath, (gltf) => {
        const model = gltf.scene;

        model.traverse((child) => {
            if (child.isMesh && child.material) {
                if (child.material.map) child.material.map.colorSpace = THREE.SRGBColorSpace;
                if (child.material.normalMap) child.material.normalMap.colorSpace = THREE.NoColorSpace;
                if (child.material.emissiveMap) child.material.emissiveMap.colorSpace = THREE.SRGBColorSpace;
                if (child.material.aoMap) child.material.aoMap.colorSpace = THREE.NoColorSpace;
                if (child.material.metalnessMap) child.material.metalnessMap.colorSpace = THREE.NoColorSpace;
                if (child.material.roughnessMap) child.material.roughnessMap.colorSpace = THREE.NoColorSpace;
                if (child.material.isMeshStandardMaterial) child.material.needsUpdate = true;
            }
        });

        scene.add(model);

        // Ensure the model is fully loaded and added to the scene
        model.updateMatrixWorld(true);

        // Calculate the bounding box of the model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        const cameraZ = (maxDim / 2) / Math.tan(fov / 2);

        // Position the camera at an equal distance from all sides
        const cameraOffset = new THREE.Vector3(0, 0, cameraZ);
        camera.position.copy(center).add(cameraOffset);
        camera.lookAt(center);

        controls.target.set(center.x, center.y, center.z);
        controls.update();
    }, undefined, function (error) {
        console.error('Ошибка загрузки модели:', error);
    });

    const animate = function () {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    };

    animate();

    window.addEventListener('resize', function () {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}
