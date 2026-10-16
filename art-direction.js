const ArtDirection = {
    textures: new Map(),
    geometries: new Map(),
    materials: new Map(),
    lamps: [],
    seed: 317,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,

    random() {
        this.seed = (this.seed * 1664525 + 1013904223) >>> 0;
        return this.seed / 4294967296;
    },

    texture(name, width, height, paint) {
        if (this.textures.has(name)) return this.textures.get(name);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        paint(canvas.getContext('2d'), width, height);
        const texture = new THREE.CanvasTexture(canvas);
        texture.encoding = THREE.sRGBEncoding;
        texture.anisotropy = 4;
        this.textures.set(name, texture);
        return texture;
    },

    surface(name) {
        return this.texture(name, 1024, 1024, (context, width, height) => {
            const colors = { wood: '#69503a', floor: '#72543b', wallpaper: '#698075', ceiling: '#8b8a75', carpet: '#503831', marble: '#a9a594', leather: '#5d7668' };
            context.fillStyle = colors[name] || '#726b56';
            context.fillRect(0, 0, width, height);
            if (name === 'floor' || name === 'wood') {
                const plankWidth = name === 'floor' ? 128 : 256;
                for (let row = 0; row < 8; row++) {
                    for (let column = -1; column < width / plankWidth; column++) {
                        const offset = row % 2 * plankWidth / 2;
                        const left = column * plankWidth + offset;
                        const top = row * 128;
                        context.fillStyle = `hsl(${27 + this.random() * 9}, ${24 + this.random() * 10}%, ${28 + this.random() * 16}%)`;
                        context.fillRect(left, top, plankWidth - 2, 126);
                        for (let grain = 0; grain < 95; grain++) {
                            context.strokeStyle = `rgba(${this.random() > .5 ? '219,175,117' : '28,22,18'},${.035 + this.random() * .12})`;
                            context.beginPath();
                            const baseline = top + this.random() * 126;
                            context.moveTo(left, baseline);
                            context.bezierCurveTo(left + 25, baseline + 3, left + 80, baseline - 3, left + plankWidth, baseline + 1);
                            context.stroke();
                        }
                        context.fillStyle = '#30271c88';
                        context.fillRect(left + 7, top + 7, 2, 2);
                        context.fillRect(left + plankWidth - 9, top + 117, 2, 2);
                    }
                }
            } else if (name === 'wallpaper') {
                for (let row = 0; row < 8; row++) {
                    for (let column = 0; column < 8; column++) {
                        const centerX = column * 128 + 64;
                        const centerY = row * 128 + 64;
                        context.strokeStyle = '#b4b39740';
                        context.lineWidth = 2;
                        context.beginPath();
                        context.moveTo(centerX, centerY - 48);
                        context.bezierCurveTo(centerX + 65, centerY - 10, centerX + 37, centerY + 22, centerX, centerY + 48);
                        context.bezierCurveTo(centerX - 37, centerY + 22, centerX - 65, centerY - 10, centerX, centerY - 48);
                        context.stroke();
                        for (let petal = 0; petal < 4; petal++) {
                            context.beginPath();
                            context.ellipse(centerX + Math.sin(petal * Math.PI / 2) * 12, centerY + Math.cos(petal * Math.PI / 2) * 12, 5, 18, -petal * Math.PI / 2, 0, Math.PI * 2);
                            context.stroke();
                        }
                    }
                }
            } else if (name === 'carpet') {
                for (let border = 0; border < 5; border++) {
                    context.strokeStyle = border % 2 ? '#aa896051' : '#252f2a';
                    context.lineWidth = border % 2 ? 9 : 14;
                    context.strokeRect(22 + border * 23, 22 + border * 23, width - 44 - border * 46, height - 44 - border * 46);
                }
                context.strokeStyle = '#bb976560';
                context.lineWidth = 4;
                for (let row = 0; row < 7; row++) {
                    for (let column = 0; column < 7; column++) {
                        const centerX = 165 + column * 115;
                        const centerY = 165 + row * 115;
                        context.beginPath();
                        context.moveTo(centerX, centerY - 32);
                        context.lineTo(centerX + 22, centerY);
                        context.lineTo(centerX, centerY + 32);
                        context.lineTo(centerX - 22, centerY);
                        context.closePath();
                        context.stroke();
                    }
                }
                context.save();
                context.translate(512, 512);
                context.rotate(Math.PI / 4);
                context.fillStyle = '#9a785a';
                context.fillRect(-95, -95, 190, 190);
                context.fillStyle = '#39433b';
                context.fillRect(-73, -73, 146, 146);
                context.restore();
            } else if (name === 'marble') {
                for (let vein = 0; vein < 24; vein++) {
                    const origin = this.random() * width;
                    context.strokeStyle = '#4b625831';
                    context.lineWidth = this.random() * 3 + .5;
                    context.beginPath();
                    context.moveTo(origin, 0);
                    context.bezierCurveTo(origin - 300, 340, origin + 230, 580, origin - 170, height);
                    context.stroke();
                }
            } else if (name === 'ceiling') {
                context.strokeStyle = '#4b5c4a60';
                context.lineWidth = 8;
                for (let tile = 0; tile < 4; tile++) {
                    for (let row = 0; row < 4; row++) {
                        context.strokeRect(tile * 256 + 12, row * 256 + 12, 232, 232);
                        context.strokeRect(tile * 256 + 25, row * 256 + 25, 206, 206);
                    }
                }
            }
            for (let fleck = 0; fleck < 16000; fleck++) {
                context.fillStyle = this.random() > .5 ? '#ffffff09' : '#0000000e';
                context.fillRect(this.random() * width, this.random() * height, this.random() * 3 + 1, 1);
            }
            const aging = context.createRadialGradient(width / 2, height / 2, 80, width / 2, height / 2, width * .72);
            aging.addColorStop(0, '#00000000');
            aging.addColorStop(1, '#10191335');
            context.fillStyle = aging;
            context.fillRect(0, 0, width, height);
        });
    },

    material(name) {
        if (this.materials.has(name)) return this.materials.get(name);
        const options = {
            wood: { map: this.surface('wood'), roughness: .72 },
            floor: { map: this.surface('floor'), roughness: .43, metalness: .05 },
            wallpaper: { map: this.surface('wallpaper'), roughness: .94 },
            ceiling: { map: this.surface('ceiling'), roughness: .93 },
            carpet: { map: this.surface('carpet'), roughness: 1 },
            marble: { map: this.surface('marble'), roughness: .28, metalness: .04 },
            leather: { map: this.surface('leather'), roughness: .72 },
            panel: { color: 0x233d35, roughness: .72 },
            brass: { color: 0xb89a62, metalness: .72, roughness: .34 },
            dark: { color: 0x162420, roughness: .82 },
            ceramic: { color: 0xd4d5b8, roughness: .24 },
            iron: { color: 0x252d29, metalness: .65, roughness: .36 },
            paper: { color: 0xcbbd99, roughness: .94 },
            rose: { color: 0x91655c, roughness: .86 },
            leaf: { color: 0x52785b, roughness: .8, side: THREE.DoubleSide },
            bulb: { color: 0xffd997, emissive: 0xffc676, emissiveIntensity: 1.4, roughness: .5 },
            fabric: { color: 0x9c8c68, roughness: .92, side: THREE.DoubleSide },
            glass: { color: 0x809f98, metalness: .25, roughness: .13, transparent: true, opacity: .65 }
        };
        const material = new THREE.MeshStandardMaterial(options[name] || { color: name, roughness: .75 });
        this.materials.set(name, material);
        return material;
    },

    shape(parent, type, size, position, material, rotation = [0, 0, 0]) {
        const key = `${type}:${size.join(',')}`;
        if (!this.geometries.has(key)) {
            const geometry = type === 'box' ? new THREE.BoxGeometry(...size)
                : type === 'sphere' ? new THREE.SphereGeometry(size[0], 16, 12)
                : type === 'torus' ? new THREE.TorusGeometry(size[0], size[1], 8, 32)
                : type === 'plane' ? new THREE.PlaneGeometry(...size)
                : new THREE.CylinderGeometry(...size);
            this.geometries.set(key, geometry);
        }
        const mesh = new THREE.Mesh(this.geometries.get(key), typeof material === 'string' ? this.material(material) : material);
        mesh.position.set(...position);
        mesh.rotation.set(...rotation);
        mesh.castShadow = type !== 'plane';
        mesh.receiveShadow = true;
        parent.add(mesh);
        return mesh;
    },

    label(parent, text, size, position, background = '#192d29', color = '#c3b38c', rotation = [0, 0, 0]) {
        const texture = this.texture(`label:${text}:${background}`, 1024, 512, (context, width, height) => {
            context.fillStyle = background;
            context.fillRect(0, 0, width, height);
            context.strokeStyle = color;
            context.lineWidth = 2;
            context.strokeRect(24, 24, width - 48, height - 48);
            context.textAlign = 'center';
            context.fillStyle = color;
            const lines = text.split('\n');
            lines.forEach((line, index) => {
                context.font = `${lines.length > 3 ? 34 : index === 0 ? 68 : 29}px Georgia, "SimSun", serif`;
                context.fillText(line, width / 2, height / 2 + (index - (lines.length - 1) / 2) * (lines.length > 3 ? 62 : 88));
            });
        });
        return this.shape(parent, 'plane', size, position, new THREE.MeshStandardMaterial({ map: texture, roughness: .85 }), rotation);
    },

    windowTexture() {
        return this.texture('rain-window', 1024, 1024, (context, width, height) => {
            const sky = context.createLinearGradient(0, 0, 0, height);
            sky.addColorStop(0, '#132731');
            sky.addColorStop(.55, '#45666b');
            sky.addColorStop(1, '#172e34');
            context.fillStyle = sky;
            context.fillRect(0, 0, width, height);
            const glow = context.createRadialGradient(715, 225, 3, 715, 225, 240);
            glow.addColorStop(0, '#d5dfce90');
            glow.addColorStop(.18, '#c5d9cd40');
            glow.addColorStop(1, '#9db7ad00');
            context.fillStyle = glow;
            context.fillRect(0, 0, width, height);
            for (let building = 0; building < 13; building++) {
                const left = building * 91 - 25;
                const top = 540 + this.random() * 240;
                context.fillStyle = building % 2 ? '#16292e' : '#22393d';
                context.fillRect(left, top, 83, height - top);
                for (let floor = top + 30; floor < height; floor += 38) {
                    for (let windowX = left + 13; windowX < left + 80; windowX += 24) {
                        context.fillStyle = this.random() > .64 ? '#b4ac7370' : '#45646645';
                        context.fillRect(windowX, floor, 8, 16);
                    }
                }
            }
            for (let branch = 0; branch < 10; branch++) {
                context.strokeStyle = '#132a30a0';
                context.lineWidth = 4;
                context.beginPath();
                context.moveTo(70, 1050);
                context.quadraticCurveTo(150 + branch * 9, 680, 70 + branch * 48, branch * 48);
                context.stroke();
            }
            for (let droplet = 0; droplet < 780; droplet++) {
                const left = this.random() * width;
                const top = this.random() * height;
                context.strokeStyle = '#c0d3ca27';
                context.lineWidth = .5 + this.random() * 1.5;
                context.beginPath();
                context.moveTo(left, top);
                context.lineTo(left - 2, top + 8 + this.random() * 40);
                context.stroke();
            }
        });
    },

    buildWindow(parent, position, rotation) {
        const group = new THREE.Group();
        group.position.set(...position);
        group.rotation.y = rotation;
        parent.add(group);
        const windowMaterial = new THREE.MeshStandardMaterial({ map: this.windowTexture(), emissiveMap: this.windowTexture(), emissive: 0x789eaa, emissiveIntensity: .6, roughness: .2, metalness: .12 });
        this.shape(group, 'plane', [3.35, 2.45], [0, 0, -.04], windowMaterial);
        for (const side of [-1, 1]) {
            this.shape(group, 'box', [.12, 2.65, .17], [side * 1.72, 0, 0], 'wood');
            this.shape(group, 'box', [3.55, .12, .17], [0, side * 1.27, 0], 'wood');
        }
        this.shape(group, 'box', [.065, 2.5, .1], [0, 0, .02], 'brass');
        this.shape(group, 'box', [3.35, .07, .1], [0, .08, .02], 'wood');
        this.shape(group, 'box', [3.65, .1, .42], [0, -1.32, .12], 'marble');
        this.shape(group, 'cylinder', [.027, .027, 4.2, 10], [0, 1.53, .23], 'brass', [0, 0, Math.PI / 2]);
        for (const side of [-1, 1]) {
            for (let fold = 0; fold < 7; fold++) {
                this.shape(group, 'cylinder', [.075, .1, 2.8, 8], [side * (1.78 + fold * .077), -.04, .19], 'fabric');
            }
            this.shape(group, 'torus', [.19, .025], [side * 2.01, -.5, .2], 'brass', [0, Math.PI / 2, 0]);
        }
        const moonFill = new THREE.PointLight(0x99c5d3, .8, 10, 1.5);
        moonFill.position.set(0, .5, 1.1);
        group.add(moonFill);
        const rainPositions = [];
        for (let streak = 0; streak < 100; streak++) {
            const left = (this.random() - .5) * 3.25;
            const top = (this.random() - .5) * 2.4;
            rainPositions.push(left, top, .012, left - .012, top - .065, .012);
        }
        const rainGeometry = new THREE.BufferGeometry();
        rainGeometry.setAttribute('position', new THREE.Float32BufferAttribute(rainPositions, 3));
        const rain = new THREE.LineSegments(rainGeometry, new THREE.LineBasicMaterial({ color: 0xafc9c6, transparent: true, opacity: .18, depthWrite: false }));
        rain.userData.rain = true;
        group.add(rain);
        this.rain.push(rain);
    },

    pendant(parent, position) {
        const group = new THREE.Group();
        group.position.set(...position);
        parent.add(group);
        this.shape(group, 'cylinder', [.012, .012, .7, 8], [0, .45, 0], 'iron');
        this.shape(group, 'cylinder', [.13, .4, .24, 32, 1, true], [0, 0, 0], 'panel');
        this.shape(group, 'torus', [.39, .014], [0, -.12, 0], 'brass', [Math.PI / 2, 0, 0]);
        this.shape(group, 'sphere', [.072], [0, -.08, 0], 'bulb');
        const light = new THREE.PointLight(0xffc57f, .8, 7, 1.6);
        light.position.y = -.3;
        group.add(light);
        this.lamps.push(light);
    },

    chair(parent, position, rotation = 0) {
        const group = new THREE.Group();
        group.position.set(...position);
        group.rotation.y = rotation;
        parent.add(group);
        this.shape(group, 'box', [.78, .12, .7], [0, .48, 0], 'leather');
        this.shape(group, 'box', [.78, .57, .12], [0, .85, -.29], 'leather', [-.12, 0, 0]);
        for (const side of [-1, 1]) {
            for (const depth of [-1, 1]) this.shape(group, 'cylinder', [.025, .037, .46, 8], [side * .31, .23, depth * .26], 'wood');
            this.shape(group, 'box', [.045, .8, .06], [side * .38, .6, -.32], 'wood', [-.12, 0, 0]);
            this.shape(group, 'sphere', [.016], [side * .2, .87, -.213], 'brass');
        }
        this.shape(group, 'box', [.82, .035, .1], [0, 1.14, -.33], 'wood', [-.12, 0, 0]);
    },

    table(parent, position, radius = .65, height = .85) {
        const group = new THREE.Group();
        group.position.set(...position);
        parent.add(group);
        this.shape(group, 'cylinder', [radius, radius, .065, 32], [0, height, 0], 'wood');
        this.shape(group, 'cylinder', [.085, .12, height, 12], [0, height / 2, 0], 'iron');
        this.shape(group, 'cylinder', [.29, .34, .06, 16], [0, .03, 0], 'iron');
        this.shape(group, 'torus', [radius - .007, .009], [0, height + .027, 0], 'brass', [Math.PI / 2, 0, 0]);
        return group;
    },

    cup(parent, position, scale = 1) {
        const group = new THREE.Group();
        group.position.set(...position);
        group.scale.setScalar(scale);
        parent.add(group);
        this.shape(group, 'cylinder', [.105, .09, .025, 24], [0, -.045, 0], 'ceramic');
        this.shape(group, 'cylinder', [.067, .047, .11, 24, 1, true], [0, .02, 0], 'ceramic');
        this.shape(group, 'cylinder', [.06, .06, .004, 24], [0, .056, 0], '#3a261d');
        this.shape(group, 'torus', [.029, .008], [.072, .022, 0], 'ceramic');
        this.shape(group, 'torus', [.065, .004], [0, .075, 0], 'brass', [Math.PI / 2, 0, 0]);
        return group;
    },

    plant(parent, position, scale = 1) {
        const group = new THREE.Group();
        group.position.set(...position);
        group.scale.setScalar(scale);
        parent.add(group);
        this.shape(group, 'cylinder', [.24, .17, .37, 20], [0, .185, 0], '#786046');
        this.shape(group, 'torus', [.233, .025], [0, .365, 0], 'brass', [Math.PI / 2, 0, 0]);
        this.shape(group, 'cylinder', [.218, .218, .025, 20], [0, .353, 0], '#242c20');
        for (let leaf = 0; leaf < 12; leaf++) {
            const angle = leaf * 2.4;
            const reach = .2 + this.random() * .2;
            const leafHeight = .55 + this.random() * .65;
            this.shape(group, 'cylinder', [.007, .01, leafHeight - .25, 5], [Math.cos(angle) * reach / 2, .25 + leafHeight / 2, Math.sin(angle) * reach / 2], 'leaf', [Math.sin(angle) * .3, 0, -Math.cos(angle) * .3]);
            const blade = this.shape(group, 'sphere', [.17], [Math.cos(angle) * reach, leafHeight, Math.sin(angle) * reach], 'leaf', [Math.sin(angle) * .5, angle, .5]);
            blade.scale.set(.5, 1.7, .12);
        }
    },

    buildEnvironment(engine) {
        this.lamps = [];
        this.rain = [];
        const room = new THREE.Group();
        room.name = 'Cafe des Souvenirs';
        engine.scene.add(room);
        const floorTexture = this.surface('floor');
        floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
        floorTexture.repeat.set(3, 3);
        this.shape(room, 'plane', [14, 14], [0, 0, 0], 'floor', [-Math.PI / 2, 0, 0]);
        this.shape(room, 'plane', [5.7, 6.7], [0, .012, .45], 'carpet', [-Math.PI / 2, 0, 0]);
        this.shape(room, 'plane', [14, 14], [0, 4, 0], 'ceiling', [Math.PI / 2, 0, 0]);
        const wallpaper = this.surface('wallpaper');
        wallpaper.wrapS = wallpaper.wrapT = THREE.RepeatWrapping;
        wallpaper.repeat.set(3, 1);
        for (let wallIndex = 0; wallIndex < 4; wallIndex++) {
            const wall = new THREE.Group();
            wall.position.set(...[[0, 0, -7], [-7, 0, 0], [0, 0, 7], [7, 0, 0]][wallIndex]);
            wall.rotation.y = wallIndex * Math.PI / 2;
            room.add(wall);
            this.shape(wall, 'plane', [14, 4], [0, 2, 0], 'wallpaper');
            this.shape(wall, 'box', [14, 1.02, .06], [0, .51, .035], 'panel');
            for (let panel = 0; panel < 14; panel++) {
                const horizontal = panel - 6.5;
                this.shape(wall, 'box', [.84, .62, .018], [horizontal, .52, .075], 'wood');
                this.shape(wall, 'box', [.78, .56, .022], [horizontal, .52, .091], 'panel');
            }
            for (const height of [.12, 1.05, 3.8]) {
                this.shape(wall, 'box', [14, .055, .14], [0, height, .1], 'wood');
                this.shape(wall, 'box', [14, .012, .016], [0, height + .035, .18], 'brass');
            }
            for (const horizontal of [-6.6, -4.7, 4.7, 6.6]) {
                this.shape(wall, 'box', [.13, 2.7, .09], [horizontal, 2.4, .055], 'wood');
            }
        }
        for (const horizontal of [-4.7, 0, 4.7]) {
            this.shape(room, 'box', [.15, .2, 14], [horizontal, 3.88, 0], 'wood');
        }
        this.shape(room, 'box', [4.5, 1.2, 1.8], [0, .6, -4.5], 'panel');
        this.shape(room, 'box', [4.7, .1, 2], [0, 1.22, -4.5], 'marble');
        for (const horizontal of [-1.5, -.5, .5, 1.5]) {
            this.shape(room, 'box', [.91, .76, .03], [horizontal, .64, -3.575], 'wood');
            this.shape(room, 'box', [.84, .68, .035], [horizontal, .64, -3.554], 'panel');
        }
        this.shape(room, 'box', [4.4, .06, .08], [0, .16, -3.5], 'brass');
        this.label(room, 'CAFÉ DES SOUVENIRS\nEST. 2014  ·  COFFEE & MEMORIES', [4.1, .8], [0, 2.78, -6.88]);
        this.label(room, 'MENU\nESPRESSO    28\nCAFÉ AU LAIT    36\nTHÉ À LA LAVANDE    32\nTODAY: A LITTLE KINDNESS', [1.1, 1.4], [-3.2, 2.45, -6.86], '#142620', '#c4c8ae');
        this.shape(room, 'box', [1.25, 1.54, .04], [-3.2, 2.45, -6.9], 'wood');
        for (const height of [1.55, 2.18]) {
            this.shape(room, 'box', [3.4, .08, .4], [.7, height, -6.7], 'wood');
            for (let cup = 0; cup < 9; cup++) this.cup(room, [-.7 + cup * .31, height + .12, -6.65], .85);
        }
        this.shape(room, 'box', [1.1, .52, .5], [-1.15, 1.54, -4.95], 'iron');
        this.shape(room, 'box', [1.06, .3, .025], [-1.15, 1.56, -4.68], 'brass');
        for (const horizontal of [-1.43, -1.02]) {
            this.shape(room, 'cylinder', [.06, .06, .04, 16], [horizontal, 1.63, -4.63], 'iron', [Math.PI / 2, 0, 0]);
            this.shape(room, 'box', [.035, .1, .025], [horizontal, 1.45, -4.58], 'iron');
            this.cup(room, [horizontal, 1.34, -4.62], .8);
        }
        this.label(room, 'SOUVENIRS', [.8, .16], [-1.15, 1.89, -4.69], '#202e27');
        this.buildWindow(room, [6.87, 2.34, -1.15], -Math.PI / 2);
        this.buildWindow(room, [3.9, 2.34, -6.87], 0);
        this.pendant(room, [-1.4, 3.2, -3.95]);
        this.pendant(room, [1.4, 3.2, -3.95]);
        this.pendant(room, [2.8, 3.17, 2.25]);
        const shelf = new THREE.Group();
        shelf.position.set(-6.7, 0, -2);
        shelf.rotation.y = Math.PI / 2;
        room.add(shelf);
        this.shape(shelf, 'box', [2.6, 3.25, .08], [0, 1.63, -.2], 'dark');
        for (const side of [-1, 1]) this.shape(shelf, 'box', [.11, 3.4, .5], [side * 1.28, 1.7, 0], 'wood');
        for (let row = 0; row < 5; row++) {
            const level = .26 + row * .65;
            this.shape(shelf, 'box', [2.65, .07, .55], [0, level, 0], 'wood');
            for (let book = 0; book < 12; book++) {
                const bookHeight = .31 + this.random() * .23;
                const horizontal = -1.1 + book * .185;
                this.shape(shelf, 'box', [.12, bookHeight, .25], [horizontal, level + bookHeight / 2 + .04, .03], ['#65503d', '#344b40', '#754d43', '#7e7658'][book % 4]);
                for (const detail of [-1, 1]) this.shape(shelf, 'box', [.12, .008, .003], [horizontal, level + bookHeight / 2 + .04 + detail * bookHeight * .33, .158], 'brass');
            }
        }
        this.label(shelf, 'LES SOUVENIRS\n每本书里，都有一场未完的雨。', [1.8, .38], [0, 3.43, .04]);
        this.table(room, [3.1, 0, 2], .72, .9);
        this.chair(room, [3.1, 0, 3.22], .12);
        this.chair(room, [4.2, 0, 1.6], -1.3);
        this.cup(room, [3.38, 1, 2.25]);
        this.table(room, [-3.45, 0, 2.1], .71, .56);
        this.table(room, [1.05, 0, 3.52], .52, .74);
        this.cup(room, [.9, .86, 3.68], .9);
        const sofa = new THREE.Group();
        sofa.position.set(-2, 0, 3.5);
        room.add(sofa);
        this.shape(sofa, 'box', [2.3, .24, .92], [0, .45, 0], 'leather');
        this.shape(sofa, 'box', [2.25, .6, .2], [0, .81, .36], 'leather', [.1, 0, 0]);
        for (const side of [-1, 1]) {
            this.shape(sofa, 'box', [.19, .37, .95], [side * 1.14, .64, 0], 'wood');
            this.shape(sofa, 'box', [.8, .1, .71], [side * .49, .61, -.03], 'leather');
            this.shape(sofa, 'box', [.35, .35, .14], [side * .73, .88, .2], 'rose', [.1, 0, side * .15]);
            for (const depth of [-1, 1]) this.shape(sofa, 'cylinder', [.045, .025, .33, 8], [side * .93, .17, depth * .3], 'wood');
        }
        for (let button = 0; button < 7; button++) this.shape(sofa, 'sphere', [.018], [-.9 + button * .3, .84, .235], 'brass');
        const fireplace = new THREE.Group();
        fireplace.position.set(0, 0, 6.55);
        fireplace.rotation.y = Math.PI;
        room.add(fireplace);
        this.shape(fireplace, 'box', [2.2, 1.4, .55], [0, .7, 0], 'marble');
        this.shape(fireplace, 'box', [1.45, 1, .035], [0, .6, .29], 'dark');
        this.shape(fireplace, 'box', [2.6, .13, .75], [0, 1.45, .08], 'wood');
        this.shape(fireplace, 'box', [2.5, .1, .65], [0, .05, .2], 'iron');
        for (let log = 0; log < 4; log++) this.shape(fireplace, 'cylinder', [.085, .065, .8, 8], [(log % 2 - .5) * .25, .2 + Math.floor(log / 2) * .14, .35], 'wood', [0, 0, Math.PI / 2 + log * .22]);
        this.plant(room, [5.55, 0, -4.4], 1.8);
        this.plant(room, [-5.6, 0, 4.7], 1.6);
        this.plant(room, [5.95, 0, 4.6], 1.15);
        this.plant(room, [2.4, 1.36, -6.65], .7);
        const lamp = new THREE.Group();
        lamp.position.set(-4.8, 0, 3.9);
        room.add(lamp);
        this.shape(lamp, 'cylinder', [.022, .022, 1.8, 12], [0, .9, 0], 'brass');
        this.shape(lamp, 'cylinder', [.25, .3, .05, 24], [0, .025, 0], 'iron');
        this.shape(lamp, 'cylinder', [.22, .39, .4, 32, 1, true], [0, 1.85, 0], 'fabric');
        this.shape(lamp, 'torus', [.39, .014], [0, 1.65, 0], 'brass', [Math.PI / 2, 0, 0]);
        this.shape(lamp, 'sphere', [.055], [0, 1.72, 0], 'bulb');
        const lampLight = new THREE.PointLight(0xffbf78, 1, 7, 1.5);
        lampLight.position.y = 1.72;
        lamp.add(lampLight);
        this.lamps.push(lampLight);
        this.label(room, 'ON SE RETROUVERA\n我们终会重逢', [1.4, .65], [-5.9, 2.55, -6.86]);
        this.shape(room, 'box', [1.52, .78, .05], [-5.9, 2.55, -6.91], 'wood');
        this.buildSupports(room);
        this.moonPattern(room);
        this.batchStatic(room);
    },

    buildSupports(room) {
        for (const location of [[1.5, .91, -2], [2.5, .56, 1], [3.5, 1.1, -3], [4, .43, 1], [-2.5, .92, -1], [-2, .7, 3]]) {
            this.table(room, [location[0], 0, location[2]], .28, location[1]);
        }
        for (const support of [[-3, 1.18, -5], [-4, 1.7, 0], [4, 1.1, -3], [0, 1.84, -5.8]]) {
            this.shape(room, 'cylinder', [.018, .023, support[1], 6], [support[0], support[1] / 2, support[2] - .045], 'wood');
            this.shape(room, 'box', [.32, .05, .16], [support[0], support[1], support[2]], 'wood');
            this.shape(room, 'box', [.4, .035, .25], [support[0], .035, support[2]], 'wood');
        }
        const door = new THREE.Group();
        door.position.set(-5, 0, -2.1);
        room.add(door);
        for (const side of [-1, 1]) this.shape(door, 'box', [.065, 2.5, .12], [side * .52, 1.25, 0], 'wood');
        this.shape(door, 'box', [1.1, .1, .12], [0, 2.52, 0], 'wood');
    },

    moonPattern(room) {
        const texture = this.texture('window-light', 512, 512, (context, width, height) => {
            context.clearRect(0, 0, width, height);
            const fade = context.createLinearGradient(0, 0, 0, height);
            fade.addColorStop(0, '#9bbac533');
            fade.addColorStop(1, '#9bbac500');
            context.fillStyle = fade;
            for (const horizontal of [18, 269]) for (const vertical of [16, 265]) context.fillRect(horizontal, vertical, 220, 223);
        });
        const pattern = this.shape(room, 'plane', [4.6, 5.3], [3.55, .018, -.7], new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: .5, depthWrite: false, blending: THREE.AdditiveBlending }), [-Math.PI / 2, 0, -.3]);
        pattern.castShadow = false;
        pattern.receiveShadow = false;
    },

    batchStatic(root) {
        root.updateMatrixWorld(true);
        const buckets = new Map();
        const sourceMeshes = [];
        root.traverse(object => {
            if (!object.isMesh || object.material.transparent) return;
            if (!buckets.has(object.material)) buckets.set(object.material, []);
            buckets.get(object.material).push(object);
            sourceMeshes.push(object);
        });
        buckets.forEach((meshes, material) => {
            const vertexCount = meshes.reduce((count, mesh) => count + (mesh.geometry.index ? mesh.geometry.index.count : mesh.geometry.attributes.position.count), 0);
            const positions = new Float32Array(vertexCount * 3);
            const normals = new Float32Array(vertexCount * 3);
            const coordinates = new Float32Array(vertexCount * 2);
            const vertex = new THREE.Vector3();
            const normal = new THREE.Vector3();
            let cursor = 0;
            meshes.forEach(mesh => {
                const geometry = mesh.geometry;
                const normalMatrix = new THREE.Matrix3().getNormalMatrix(mesh.matrixWorld);
                const count = geometry.index ? geometry.index.count : geometry.attributes.position.count;
                for (let index = 0; index < count; index++) {
                    const source = geometry.index ? geometry.index.getX(index) : index;
                    vertex.fromBufferAttribute(geometry.attributes.position, source).applyMatrix4(mesh.matrixWorld);
                    normal.fromBufferAttribute(geometry.attributes.normal, source).applyMatrix3(normalMatrix).normalize();
                    positions.set(vertex.toArray(), cursor * 3);
                    normals.set(normal.toArray(), cursor * 3);
                    coordinates[cursor * 2] = geometry.attributes.uv.getX(source);
                    coordinates[cursor * 2 + 1] = geometry.attributes.uv.getY(source);
                    cursor++;
                }
            });
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
            geometry.setAttribute('uv', new THREE.BufferAttribute(coordinates, 2));
            geometry.computeBoundingSphere();
            const batch = new THREE.Mesh(geometry, material);
            batch.castShadow = true;
            batch.receiveShadow = true;
            batch.name = 'Static material batch';
            root.add(batch);
        });
        sourceMeshes.forEach(mesh => mesh.removeFromParent ? mesh.removeFromParent() : mesh.parent.remove(mesh));
    },

    photoTexture(painting = false) {
        return this.texture(painting ? 'painting' : 'wedding-photo', 512, 512, (context, width, height) => {
            const sky = context.createLinearGradient(0, 0, 0, height);
            sky.addColorStop(0, '#aebbb0');
            sky.addColorStop(1, '#dfc59c');
            context.fillStyle = sky;
            context.fillRect(0, 0, width, height);
            context.fillStyle = '#4a6656';
            context.fillRect(0, 280, width, 232);
            if (painting) {
                context.fillStyle = '#7d6b4c';
                context.fillRect(65, 125, 360, 310);
                context.fillStyle = '#263f38';
                context.fillRect(80, 180, 330, 36);
                context.fillStyle = '#c5b992';
                context.font = '19px Georgia';
                context.fillText('CAFÉ DES SOUVENIRS', 111, 206);
                for (const horizontal of [94, 215, 315]) {
                    context.fillStyle = '#688b88';
                    context.fillRect(horizontal, 242, 80, 148);
                    context.fillStyle = '#d4c5a3';
                    context.fillRect(horizontal + 38, 242, 4, 148);
                    context.fillRect(horizontal, 304, 80, 4);
                }
                context.fillStyle = '#3d5341';
                context.fillRect(0, 420, 512, 92);
            } else {
                for (let tree = 0; tree < 5; tree++) {
                    context.fillStyle = '#645f43';
                    context.fillRect(tree * 140 - 20, 0, 15, 420);
                    for (let blossom = 0; blossom < 70; blossom++) {
                        context.fillStyle = ['#d7b9a1', '#e6cebd', '#baa192'][blossom % 3];
                        context.beginPath();
                        context.arc(tree * 140 - 15 + (this.random() - .5) * 150, this.random() * 190, 4 + this.random() * 11, 0, Math.PI * 2);
                        context.fill();
                    }
                }
                context.fillStyle = '#35443d';
                context.beginPath();
                context.moveTo(159, 276);
                context.lineTo(134, 450);
                context.lineTo(237, 450);
                context.lineTo(217, 276);
                context.fill();
                context.fillStyle = '#e0d2b4';
                context.beginPath();
                context.moveTo(265, 269);
                context.lineTo(225, 452);
                context.lineTo(376, 452);
                context.lineTo(310, 269);
                context.fill();
                for (const horizontal of [187, 288]) {
                    context.fillStyle = '#4d392e';
                    context.beginPath();
                    context.ellipse(horizontal, 238, 27, 33, 0, 0, Math.PI * 2);
                    context.fill();
                    context.fillStyle = '#b99b79';
                    context.beginPath();
                    context.ellipse(horizontal, 244, 21, 25, 0, 0, Math.PI * 2);
                    context.fill();
                }
            }
            for (let stroke = 0; stroke < 4000; stroke++) {
                context.fillStyle = this.random() > .5 ? '#e3cda812' : '#283f2e0c';
                context.fillRect(this.random() * width, this.random() * height, painting ? 8 : 2, painting ? 3 : 1);
            }
            context.fillStyle = '#dbcba2';
            context.fillRect(0, 472, width, 40);
            context.fillStyle = '#6b614a';
            context.textAlign = 'center';
            context.font = '16px Georgia';
            context.fillText(painting ? 'Un endroit pour nous.' : 'L & Y  ·  Spring, 2014', width / 2, 496);
        });
    },

    framed(parent, size, image, hotspot) {
        const frame = new THREE.Group();
        parent.add(frame);
        this.shape(frame, 'box', [size[0] + .06, size[1] + .06, .025], [0, 0, -.022], 'wood');
        const picture = this.shape(frame, 'plane', [size[0], size[1]], [0, 0, .004], new THREE.MeshStandardMaterial({ map: image, roughness: .75 }));
        if (hotspot) picture.userData = { isHotspot: true, id: hotspot };
        for (const side of [-1, 1]) {
            this.shape(frame, 'box', [size[0] + .07, .025, .035], [0, side * (size[1] / 2 + .02), .009], 'brass');
            this.shape(frame, 'box', [.025, size[1] + .045, .035], [side * (size[0] / 2 + .02), 0, .009], 'brass');
        }
    },

    item(data) {
        const group = new THREE.Group();
        group.name = data.name;
        const size = data.visual.size;
        if (data.id === 'music_box') {
            this.shape(group, 'box', [.3, .2, .3], [0, 0, 0], 'wood');
            for (const level of [-.085, .085]) this.shape(group, 'box', [.31, .014, .31], [0, level, 0], 'brass');
            this.label(group, 'POUR TOI\nL & Y', [.16, .08], [0, .025, .151], '#3b3526');
            this.shape(group, 'box', [.3, .022, .27], [0, .145, -.03], 'wood', [-.5, 0, 0]);
            this.shape(group, 'box', [.245, .012, .22], [0, .158, -.03], 'brass', [-.5, 0, 0]);
            const key = this.shape(group, 'cylinder', [.045, .045, .035, 24], [0, -.113, 0], 'brass');
            key.userData = { isHotspot: true, id: 'music_box_key' };
            this.shape(group, 'box', [.08, .015, .014], [0, -.137, 0], 'iron');
            for (const horizontal of [-.11, .11]) for (const depth of [-.11, .11]) this.shape(group, 'sphere', [.021], [horizontal, -.109, depth], 'brass');
        } else if (data.id === 'wedding_photo' || data.id === 'painting') {
            this.framed(group, size, this.photoTexture(data.id === 'painting'), data.id === 'painting' ? 'painting_solve' : null);
        } else if (data.id === 'coffee_cup') {
            this.cup(group, [0, -.02, 0], 1.15);
            this.label(group, 'LUCKY', [.052, .025], [0, .013, .077], '#d1d2b9', '#35534d');
        } else if (data.id === 'old_diary') {
            this.shape(group, 'box', [.255, .055, .36], [0, 0, 0], 'wood');
            this.shape(group, 'box', [.237, .035, .342], [.006, 0, .003], 'paper');
            for (const level of [-.024, .024]) this.shape(group, 'box', [.258, .01, .364], [0, level, 0], '#4c3428');
            this.label(group, 'NOTES\n17 MARS 2014', [.19, .22], [0, .031, 0], '#4c3428', '#c1a478', [-Math.PI / 2, 0, 0]);
            this.shape(group, 'box', [.019, .003, .1], [.08, .033, .14], 'rose');
            this.shape(group, 'box', [.043, .04, .02], [.123, 0, 0], 'brass');
        } else if (data.id === 'letters' || data.id === 'ticket_stub') {
            this.shape(group, 'box', size, [0, 0, 0], 'paper');
            this.label(group, data.id === 'letters' ? 'Ma très chère,\nJe me souviens de la pluie.\nJe me souviens de nous.\nAvec tout mon amour,\nY.' : 'CINÉMA\nTITANIC · 20.05.2014', [size[0] * .92, size[2] * .92], [0, size[1] / 2 + .001, 0], '#d2c6a5', '#6d6a55', [-Math.PI / 2, 0, 0]);
            if (data.id === 'letters') {
                this.shape(group, 'box', [.032, .001, .405], [0, .022, 0], 'rose');
                this.shape(group, 'torus', [.025, .005], [0, .03, 0], 'rose', [Math.PI / 2, 0, 0]);
            }
        } else if (data.id === 'clock') {
            this.shape(group, 'cylinder', [.18, .18, .07, 32], [0, 0, 0], 'brass', [Math.PI / 2, 0, 0]);
            const dial = this.texture('clock-dial', 512, 512, (context) => {
                context.fillStyle = '#d2c7a8';
                context.fillRect(0, 0, 512, 512);
                context.translate(256, 256);
                context.strokeStyle = '#625c42';
                context.fillStyle = '#504f3c';
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                context.font = '32px Georgia';
                for (let hour = 1; hour <= 12; hour++) {
                    const angle = hour / 12 * Math.PI * 2;
                    context.fillText(hour, Math.sin(angle) * 175, -Math.cos(angle) * 175);
                }
                context.lineWidth = 9;
                context.beginPath();
                context.moveTo(0, 0);
                context.lineTo(88, 27);
                context.moveTo(0, 0);
                context.lineTo(-44, 143);
                context.stroke();
            });
            this.shape(group, 'plane', [.32, .32], [0, 0, .037], new THREE.MeshStandardMaterial({ map: dial, roughness: .6 }));
            this.shape(group, 'box', [.3, .05, .11], [0, -.18, 0], 'wood');
        } else if (data.id === 'mirror') {
            const reflection = this.texture('mirror-patina', 256, 512, (context, width, height) => {
                const gradient = context.createLinearGradient(0, 0, width, height);
                gradient.addColorStop(0, '#93aba5');
                gradient.addColorStop(.45, '#3a5857');
                gradient.addColorStop(.53, '#73948a');
                gradient.addColorStop(1, '#1d3638');
                context.fillStyle = gradient;
                context.fillRect(0, 0, width, height);
                context.fillStyle = '#d4ddc18a';
                context.font = '48px Georgia';
                context.fillText('ELI', 78, 270);
            });
            this.framed(group, size, reflection);
        } else if (data.id === 'teddy_bear') {
            const plush = new THREE.MeshStandardMaterial({ color: 0x9b8059, roughness: 1 });
            const body = this.shape(group, 'sphere', [.13], [0, 0, 0], plush);
            body.scale.set(1, 1.2, .75);
            this.shape(group, 'sphere', [.098], [0, .17, 0], plush);
            this.shape(group, 'sphere', [.047], [0, .145, .083], 'fabric');
            for (const side of [-1, 1]) {
                this.shape(group, 'sphere', [.043], [side * .075, .241, 0], plush);
                this.shape(group, 'sphere', [.014], [side * .039, .19, .088], 'dark');
                const arm = this.shape(group, 'sphere', [.061], [side * .13, .005, 0], plush);
                arm.scale.set(1, 1.4, 1);
                this.shape(group, 'sphere', [.071], [side * .08, -.12, .06], plush);
            }
            this.shape(group, 'sphere', [.016], [0, .161, .127], 'dark');
            this.shape(group, 'box', [.16, .023, .075], [0, .08, .043], 'rose');
        } else if (data.id === 'medicine_bottle' || data.id === 'perfume') {
            const medicine = data.id === 'medicine_bottle';
            this.shape(group, 'cylinder', [.061, .057, .13, 24], [0, 0, 0], medicine ? 'ceramic' : 'glass');
            this.shape(group, 'cylinder', [.047, .047, .034, 24], [0, .079, 0], medicine ? 'paper' : 'brass');
            this.label(group, medicine ? 'FLUOXETINE\n20 mg · 09/2018' : 'LAVENDER\nDREAM', [.073, .076], [0, 0, .06], '#cbbf9e', '#506254');
        } else if (data.id === 'ring') {
            this.shape(group, 'torus', [.058, .009], [0, 0, 0], 'brass', [Math.PI / 2, 0, 0]);
            this.shape(group, 'sphere', [.014], [0, .018, -.055], 'glass');
        } else if (data.id === 'key' || data.id === 'hairpin') {
            const length = data.id === 'key' ? .1 : .16;
            this.shape(group, 'cylinder', [.008, .008, length, 10], [0, 0, 0], 'brass');
            this.shape(group, 'torus', [.024, .006], [0, length / 2 + .017, 0], 'brass');
            for (const level of [-.035, -.02]) this.shape(group, 'box', [.03, .013, .012], [.012, level, 0], 'brass');
        } else if (data.id === 'phone') {
            this.shape(group, 'box', [.095, .17, .015], [0, 0, 0], 'iron');
            this.label(group, '19:33\n未发送\n对不起……', [.08, .132], [0, .008, .008], '#38524b', '#abb6a3');
            this.shape(group, 'sphere', [.007], [0, -.067, .009], 'brass');
            this.shape(group, 'box', [.001, .13, .001], [.018, .008, .01], 'paper', [0, 0, .32]);
        } else if (data.id === 'umbrella') {
            this.shape(group, 'cylinder', [.042, .014, .38, 12], [0, 0, 0], 'dark');
            this.shape(group, 'torus', [.035, .01], [0, .23, 0], 'wood');
            this.shape(group, 'box', [.06, .04, .002], [0, .1, .03], 'paper');
        } else if (data.id === 'secret_door') {
            this.shape(group, 'box', [.92, 2, .065], [0, -.5, 0], 'panel');
            for (const level of [-1, -.35, .3]) {
                this.shape(group, 'box', [.69, .49, .018], [0, level, .042], 'wood');
                this.shape(group, 'box', [.62, .42, .02], [0, level, .055], 'panel');
            }
            this.shape(group, 'sphere', [.035], [.31, -.3, .1], 'brass');
            this.label(group, 'PRIVATE\n只留给你', [.23, .13], [0, .32, .079]);
        } else {
            this.shape(group, 'box', size, [0, 0, 0], 'wood');
        }
        return group;
    },

    createDust(engine) {
        const positions = [];
        for (let mote = 0; mote < 220; mote++) positions.push((this.random() - .5) * 12, this.random() * 3.8, (this.random() - .5) * 12);
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        const texture = this.texture('dust', 32, 32, (context) => {
            const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 15);
            gradient.addColorStop(0, '#fff9dc');
            gradient.addColorStop(.2, '#fff9dc90');
            gradient.addColorStop(1, '#fff9dc00');
            context.fillStyle = gradient;
            context.fillRect(0, 0, 32, 32);
        });
        engine.particles = new THREE.Points(geometry, new THREE.PointsMaterial({ map: texture, color: 0xd3c29d, size: .024, transparent: true, opacity: .2, depthWrite: false }));
        engine.scene.add(engine.particles);
    },

    configure(engine) {
        engine.renderer.outputEncoding = THREE.sRGBEncoding;
        engine.renderer.toneMappingExposure = .96;
        engine.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        engine.scene.background.set(0x12232b);
        engine.scene.fog.color.set(0x182e30);
        engine.scene.fog.density = .027;
        engine.scene.children.filter(child => child.isAmbientLight).forEach(light => {
            light.color.set(0x9eaea3);
            light.intensity = .16;
        });
        engine.scene.children.filter(child => child.isDirectionalLight).forEach(light => {
            light.color.set(0xadcbd1);
            light.intensity = .15;
        });
        engine.scene.add(new THREE.HemisphereLight(0xb6c9bf, 0x4c362a, .24));
        engine.ceilingLight.intensity = .42;
        engine.ceilingLight.color.set(0xffdbad);
        engine.ceilingLight.position.set(0, 3.65, 0);
        engine.ceilingLight.distance = 15;
        engine.ceilingLight.shadow.mapSize.set(1024, 1024);
        engine.ceilingLight.shadow.bias = -.001;
        engine.ceilingLight.shadow.normalBias = .035;
        engine.flashlight.color.set(0xffecd2);
        engine.flashlight.angle = Math.PI / 7;
        engine.flashlight.penumbra = .85;
        engine.flashlight.shadow.mapSize.set(512, 512);
        engine.flashlight.shadow.bias = -.002;
        engine.inspectLight = new THREE.PointLight(0xffdeb0, 0, 3, 1);
        engine.inspectLight.position.set(-.25, .25, .2);
        engine.camera.add(engine.inspectLight);
        engine.camera.fov = 62;
        engine.camera.updateProjectionMatrix();
        this.menuCamera(engine);
    },

    menuCamera(engine) {
        engine.camera.position.set(3.75, 2.1, 5.8);
        engine.camera.lookAt(-.6, 1.5, -3.8);
        engine.flashlight.intensity = 0;
    },

    playCamera(engine) {
        engine.camera.position.set(0, 1.6, 5);
        engine.camera.rotation.set(0, 0, 0);
        engine.flashlight.intensity = engine.state.flashlightOn ? 1.5 : 0;
    },

    update(engine, time, delta) {
        document.body.classList.toggle('in-game', engine.state.game === 'playing');
        document.body.classList.toggle('inspecting', engine.state.isInspecting);
        if (this.reducedMotion) return;
        this.lamps.forEach((light, index) => {
            const base = index === this.lamps.length - 1 ? 1 : .8;
            light.intensity = base * (1 + Math.sin(time * .0008 + index * 2) * .022);
        });
        this.rain.forEach(rain => {
            const positions = rain.geometry.attributes.position.array;
            for (let index = 0; index < positions.length; index += 6) {
                positions[index + 1] -= delta * .7;
                if (positions[index + 1] < -1.1) positions[index + 1] = 1.2;
                positions[index + 4] = positions[index + 1] - .065;
            }
            rain.geometry.attributes.position.needsUpdate = true;
        });
    }
};
