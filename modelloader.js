export function createScene(containerId, modelUrl, hdriTexture) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Контейнер с ID ${containerId} не найден.`);
        return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.01, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    container.appendChild(renderer.domElement);

    

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.enableZoom = true;

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const hdriLoader = new THREE.RGBELoader();
    hdriLoader.load(hdriTexture, function (texture) {
        
        
        
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        pmremGenerator.dispose();
        texture.dispose();
        

        scene.environment = envMap;

    });

    const loader = new THREE.GLTFLoader();
    const dracoLoader = new THREE.DRACOLoader();
    dracoLoader.setDecoderPath('/examples/js/libs/draco/');
    loader.setDRACOLoader(dracoLoader);

    loader.load(modelUrl, function (gltf) {
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
        

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI/360);
        const cameraZ = (maxDim / 2) / Math.tan(fov/1.2);

        const cameraOffset = new THREE.Vector3(maxDim-20, maxDim+10, maxDim+20).normalize().multiplyScalar(cameraZ);
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
