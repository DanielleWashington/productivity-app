const test = require('node:test');
const assert = require('node:assert/strict');

const {
    ENERGY_QUESTIONS,
    ENERGY_TYPES,
    calculateEnergyType,
    formatIdentityTag,
    getEnergyDescription
} = require('../profile.js');

test('the mini-quiz exposes five behavioral questions with every energy type available', () => {
    assert.equal(ENERGY_QUESTIONS.length, 5);

    const expectedTypes = Object.keys(ENERGY_TYPES).sort();
    ENERGY_QUESTIONS.forEach(question => {
        assert.equal(question.answers.length, 5);
        assert.deepEqual(question.answers.map(answer => answer.type).sort(), expectedTypes);
    });
});

test('plurality scoring returns the energy type selected most often', () => {
    assert.equal(
        calculateEnergyType([
            'Manifesting Generator',
            'Generator',
            'Manifesting Generator',
            'Projector',
            'Manifesting Generator'
        ]),
        'Manifesting Generator'
    );
});

test('plurality scoring ignores invalid values instead of inventing a profile', () => {
    assert.equal(calculateEnergyType(['Unknown', '', null]), null);
});

test('identity tag combines optional energy type and sun sign', () => {
    assert.equal(
        formatIdentityTag({ energyType: 'Generator', sunSign: 'Leo' }),
        'Generator energy · Leo'
    );
});

test('identity tag remains useful when only one optional value exists', () => {
    assert.equal(formatIdentityTag({ energyType: 'Projector' }), 'Projector energy');
    assert.equal(formatIdentityTag({ sunSign: 'Pisces' }), 'Pisces');
});

test('identity tag is empty when optional profile values are absent or invalid', () => {
    assert.equal(formatIdentityTag({}), '');
    assert.equal(formatIdentityTag({ energyType: 'Unknown', sunSign: 'Ophiuchus' }), '');
});

test('each valid energy type has a short result description', () => {
    Object.keys(ENERGY_TYPES).forEach(type => {
        assert.equal(getEnergyDescription(type), ENERGY_TYPES[type].description);
        assert.ok(getEnergyDescription(type).length > 20);
    });
    assert.equal(getEnergyDescription('Unknown'), '');
});
