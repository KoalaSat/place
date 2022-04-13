const { readFileSync } = require('fs');
const {
    assertSucceeds,
    initializeTestEnvironment,
    assertFails
} = require('@firebase/rules-unit-testing');
const {
    collection,
    doc,
    addDoc,
    setDoc,
    updateDoc,
    arrayUnion,
    setLogLevel,
    serverTimestamp
} = require('firebase/firestore');

let testEnvironment;

const MY_PROJECT_ID = 'place-3bfaa';

before(async () => {
    setLogLevel('error');

    testEnvironment = await initializeTestEnvironment({
        projectId: MY_PROJECT_ID,
        firestore: {
            rules: readFileSync('firestore.rules', 'utf8'),
            port: 8080,
            host: 'localhost'
        }
    });
});

after(async () => {
    await testEnvironment.cleanup();
});

beforeEach(async () => {
    await testEnvironment.clearFirestore();
});

describe('create pixel', () => {
    it('should only be created by authenticated users', async () => {
        const unauthedDB = testEnvironment.unauthenticatedContext().firestore();
        await assertFails(
            addDoc(collection(unauthedDB, 'pixels'), {
                pixel: 0,
                previousPixels: [],
                createdAt: serverTimestamp(),
                lastUpdated: serverTimestamp()
            })
        );

        const authedDB = testEnvironment
            .authenticatedContext('user')
            .firestore();
        await assertSucceeds(
            addDoc(collection(authedDB, 'pixels'), {
                pixel: 0,
                previousPixels: [],
                createdAt: serverTimestamp(),
                lastUpdated: serverTimestamp()
            })
        );
    });

    it('should only have all required fields', async () => {
        const authedDB = testEnvironment
            .authenticatedContext('user')
            .firestore();

        await assertFails(
            addDoc(collection(authedDB, 'pixels'), {
                previousPixels: [],
                createdAt: serverTimestamp(),
                lastUpdated: serverTimestamp()
            })
        );

        await assertFails(
            addDoc(collection(authedDB, 'pixels'), {
                pixel: 0,
                previousPixels: [],
                createdAt: serverTimestamp(),
                lastUpdated: serverTimestamp(),
                forbidden: 'a'
            })
        );

        await assertSucceeds(
            addDoc(collection(authedDB, 'pixels'), {
                pixel: 0,
                previousPixels: [],
                createdAt: serverTimestamp(),
                lastUpdated: serverTimestamp()
            })
        );
    });

    it('should only have required data types', async () => {
        const authedDB = testEnvironment
            .authenticatedContext('user')
            .firestore();

        await assertFails(
            addDoc(collection(authedDB, 'pixels'), {
                pixel: '0',
                previousPixels: [],
                createdAt: serverTimestamp(),
                lastUpdated: serverTimestamp()
            })
        );

        await assertFails(
            addDoc(collection(authedDB, 'pixels'), {
                pixel: 0,
                previousPixels: 10,
                createdAt: serverTimestamp(),
                lastUpdated: serverTimestamp()
            })
        );

        await assertFails(
            addDoc(collection(authedDB, 'pixels'), {
                pixel: 0,
                previousPixels: [1, 2],
                createdAt: serverTimestamp(),
                lastUpdated: serverTimestamp()
            })
        );

        await assertFails(
            addDoc(collection(authedDB, 'pixels'), {
                pixel: 0,
                previousPixels: [],
                createdAt: new Date(),
                lastUpdated: serverTimestamp()
            })
        );

        await assertFails(
            addDoc(collection(authedDB, 'pixels'), {
                pixel: 0,
                previousPixels: [],
                createdAt: serverTimestamp(),
                lastUpdated: new Date()
            })
        );

        await assertSucceeds(
            addDoc(collection(authedDB, 'pixels'), {
                pixel: 0,
                previousPixels: [],
                createdAt: serverTimestamp(),
                lastUpdated: serverTimestamp()
            })
        );
    });
});

describe('update pixel', async () => {
    it('should only be updated by authenticated users', async () => {
        await testEnvironment.withSecurityRulesDisabled(async context => {
            await setDoc(doc(context.firestore(), 'pixels', '1'), {
                pixel: 0,
                previousPixels: [],
                createdAt: serverTimestamp(),
                lastUpdated: serverTimestamp()
            });
        });

        const unauthedDB = testEnvironment.unauthenticatedContext().firestore();
        await assertFails(
            updateDoc(doc(unauthedDB, 'pixels', '1'), {
                pixel: {
                    x: 0,
                    y: 0,
                    color: '#222222'
                },
                lastUpdated: serverTimestamp(),
                previousPixels: arrayUnion(0)
            })
        );

        const authedDB = testEnvironment
            .authenticatedContext('user')
            .firestore();
        await assertSucceeds(
            updateDoc(doc(authedDB, 'pixels', '1'), {
                pixel: {
                    x: 0,
                    y: 0,
                    color: '#222222'
                },
                lastUpdated: serverTimestamp(),
                previousPixels: arrayUnion(0)
            })
        );
    });

    it('should only update allowed fields', async () => {
        await testEnvironment.withSecurityRulesDisabled(async context => {
            await setDoc(doc(context.firestore(), 'pixels', '1'), {
                pixel: 0,
                previousPixels: [],
                createdAt: serverTimestamp(),
                lastUpdated: serverTimestamp()
            });
        });

        const authedDB = testEnvironment
            .authenticatedContext('user')
            .firestore();

        await assertFails(
            updateDoc(doc(authedDB, 'pixels', '1'), {
                pixel: {
                    x: -1,
                    y: 0,
                    color: '#222222'
                },
                lastUpdated: serverTimestamp(),
                previousPixels: arrayUnion({
                    x: 0,
                    y: 0,
                    color: '#222222',
                    createdAt: new Date()
                })
            })
        );
        await assertFails(
            updateDoc(doc(authedDB, 'pixels', '1'), {
                pixel: {
                    x: 341,
                    y: 0,
                    color: '#222222'
                },
                lastUpdated: serverTimestamp(),
                previousPixels: arrayUnion({
                    x: 0,
                    y: 0,
                    color: '#222222',
                    createdAt: new Date()
                })
            })
        );

        await assertFails(
            updateDoc(doc(authedDB, 'pixels', '1'), {
                pixel: {
                    x: 0,
                    y: -1,
                    color: '#222222'
                },
                lastUpdated: serverTimestamp(),
                previousPixels: arrayUnion({
                    x: 0,
                    y: 0,
                    color: '#222222',
                    createdAt: new Date()
                })
            })
        );
        await assertFails(
            updateDoc(doc(authedDB, 'pixels', '1'), {
                pixel: {
                    x: 0,
                    y: 341,
                    color: '#222222'
                },
                lastUpdated: serverTimestamp(),
                previousPixels: arrayUnion({
                    x: 0,
                    y: 0,
                    color: '#222222',
                    createdAt: new Date()
                })
            })
        );

        await assertFails(
            updateDoc(doc(authedDB, 'pixels', '1'), {
                pixel: {
                    x: 0,
                    y: 0,
                    color: 'orange'
                },
                lastUpdated: serverTimestamp(),
                previousPixels: arrayUnion({
                    x: 0,
                    y: 0,
                    color: '#222222',
                    createdAt: new Date()
                })
            })
        );

        await assertFails(
            updateDoc(doc(authedDB, 'pixels', '1'), {
                pixel: {
                    x: 0,
                    y: 0,
                    color: '#222222',
                    forbidden: true
                },
                lastUpdated: serverTimestamp(),
                previousPixels: arrayUnion({
                    x: 0,
                    y: 0,
                    color: '#222222',
                    createdAt: new Date()
                })
            })
        );

        await assertFails(
            updateDoc(doc(authedDB, 'pixels', '1'), {
                pixel: {
                    x: 0,
                    y: 0,
                    color: '#222222'
                },
                lastUpdated: serverTimestamp(),
                previousPixels: arrayUnion({
                    x: 0,
                    y: 0,
                    createdAt: new Date()
                })
            })
        );

        await assertFails(
            updateDoc(doc(authedDB, 'pixels', '1'), {
                pixel: {
                    x: 0,
                    y: 0,
                    color: '#222222'
                },
                lastUpdated: new Date(),
                previousPixels: arrayUnion({
                    x: 0,
                    y: 0,
                    color: '#222222',
                    createdAt: new Date()
                })
            })
        );

        await assertFails(
            updateDoc(doc(authedDB, 'pixels', '1'), {
                pixel: {
                    x: 0,
                    y: 0,
                    color: '#222222'
                },
                lastUpdated: serverTimestamp(),
                previousPixels: arrayUnion({
                    x: -1,
                    y: 0,
                    color: '#222222',
                    createdAt: new Date()
                })
            })
        );
        await assertFails(
            updateDoc(doc(authedDB, 'pixels', '1'), {
                pixel: {
                    x: 0,
                    y: 0,
                    color: '#222222'
                },
                lastUpdated: serverTimestamp(),
                previousPixels: arrayUnion({
                    x: 341,
                    y: 0,
                    color: '#222222',
                    createdAt: new Date()
                })
            })
        );

        await assertFails(
            updateDoc(doc(authedDB, 'pixels', '1'), {
                pixel: {
                    x: 0,
                    y: 0,
                    color: '#222222'
                },
                lastUpdated: serverTimestamp(),
                previousPixels: arrayUnion({
                    x: 0,
                    y: -1,
                    color: '#222222',
                    createdAt: new Date()
                })
            })
        );
        await assertFails(
            updateDoc(doc(authedDB, 'pixels', '1'), {
                pixel: {
                    x: 0,
                    y: 0,
                    color: '#222222'
                },
                lastUpdated: serverTimestamp(),
                previousPixels: arrayUnion({
                    x: 0,
                    y: 341,
                    color: '#222222',
                    createdAt: new Date()
                })
            })
        );

        await assertFails(
            updateDoc(doc(authedDB, 'pixels', '1'), {
                pixel: {
                    x: 0,
                    y: 0,
                    color: '#222222'
                },
                lastUpdated: serverTimestamp(),
                previousPixels: arrayUnion({
                    x: 0,
                    y: 0,
                    color: 'orange',
                    createdAt: new Date()
                })
            })
        );

        await assertFails(
            updateDoc(doc(authedDB, 'pixels', '1'), {
                pixel: {
                    x: 0,
                    y: 0,
                    color: '#222222'
                },
                lastUpdated: serverTimestamp(),
                previousPixels: arrayUnion({
                    x: 0,
                    y: 0,
                    color: '#222222',
                    createdAt: 0
                })
            })
        );

        await assertFails(
            updateDoc(doc(authedDB, 'pixels', '1'), {
                pixel: {
                    x: 0,
                    y: 0,
                    color: '#222222'
                },
                lastUpdated: serverTimestamp(),
                previousPixels: arrayUnion({
                    x: 0,
                    y: 0,
                    color: '#222222',
                    createdAt: new Date(),
                    forbidden: true
                })
            })
        );

        await assertSucceeds(
            updateDoc(doc(authedDB, 'pixels', '1'), {
                pixel: {
                    x: 0,
                    y: 0,
                    color: '#222222'
                },
                lastUpdated: serverTimestamp(),
                previousPixels: arrayUnion(0)
            })
        );

        await assertSucceeds(
            updateDoc(doc(authedDB, 'pixels', '1'), {
                pixel: {
                    x: 0,
                    y: 0,
                    color: '#222222'
                },
                lastUpdated: serverTimestamp(),
                previousPixels: arrayUnion({
                    x: 0,
                    y: 0,
                    color: '#222222',
                    createdAt: new Date()
                })
            })
        );
    });
});

describe('create user', async () => {
    it('should only be created by authenticated users', async () => {
        await testEnvironment.withSecurityRulesDisabled(async context => {
            await setDoc(doc(context.firestore(), 'pixels', '1'), {
                pixel: 0,
                previousPixels: [],
                createdAt: serverTimestamp(),
                lastUpdated: serverTimestamp()
            });
        });

        const unauthedDB = testEnvironment.unauthenticatedContext().firestore();
        await assertFails(
            addDoc(collection(unauthedDB, 'users'), {
                pixel: '1',
                createdAt: serverTimestamp()
            })
        );

        const authedDB = testEnvironment
            .authenticatedContext('user')
            .firestore();
        await assertSucceeds(
            addDoc(collection(authedDB, 'users'), {
                pixel: '1',
                createdAt: serverTimestamp()
            })
        );
    });

    it('should only have all required fields', async () => {
        await testEnvironment.withSecurityRulesDisabled(async context => {
            await setDoc(doc(context.firestore(), 'pixels', '1'), {
                pixel: 0,
                previousPixels: [],
                createdAt: serverTimestamp(),
                lastUpdated: serverTimestamp()
            });
        });

        const authedDB = testEnvironment
            .authenticatedContext('user')
            .firestore();

        await assertFails(
            addDoc(collection(authedDB, 'users'), {
                createdAt: serverTimestamp()
            })
        );

        await assertFails(
            addDoc(collection(authedDB, 'users'), {
                pixel: '1'
            })
        );

        await assertFails(
            addDoc(collection(authedDB, 'users'), {
                pixel: '1',
                createdAt: serverTimestamp(),
                forbidden: 'a'
            })
        );

        await assertSucceeds(
            addDoc(collection(authedDB, 'users'), {
                pixel: '1',
                createdAt: serverTimestamp()
            })
        );
    });

    it('should only have required data types', async () => {
        await testEnvironment.withSecurityRulesDisabled(async context => {
            await setDoc(doc(context.firestore(), 'pixels', '1'), {
                pixel: 0,
                previousPixels: [],
                createdAt: serverTimestamp(),
                lastUpdated: serverTimestamp()
            });
        });

        const authedDB = testEnvironment
            .authenticatedContext('user')
            .firestore();

        await assertFails(
            addDoc(collection(authedDB, 'users'), {
                pixel: 1,
                createdAt: serverTimestamp()
            })
        );

        await assertFails(
            addDoc(collection(authedDB, 'users'), {
                pixel: '1',
                createdAt: new Date()
            })
        );

        await assertSucceeds(
            addDoc(collection(authedDB, 'users'), {
                pixel: '1',
                createdAt: serverTimestamp()
            })
        );
    });

    it('should only allow real pixels', async () => {
        await testEnvironment.withSecurityRulesDisabled(async context => {
            await setDoc(doc(context.firestore(), 'pixels', '1'), {
                pixel: 0,
                previousPixels: [],
                createdAt: serverTimestamp(),
                lastUpdated: serverTimestamp()
            });
        });

        const authedDB = testEnvironment
            .authenticatedContext('user')
            .firestore();

        await assertFails(
            addDoc(collection(authedDB, 'users'), {
                pixel: 'fakePixel',
                createdAt: serverTimestamp()
            })
        );

        await assertSucceeds(
            addDoc(collection(authedDB, 'users'), {
                pixel: '1',
                createdAt: serverTimestamp()
            })
        );
    });
});
