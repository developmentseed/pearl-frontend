const {
  restApiEndpoint,
} = require('../../app/assets/scripts/config/testing').default;

const FAKE_API_TOKEN = 'FAKE_API_TOKEN';

const authHeaders = {
  Authorization: `Bearer ${FAKE_API_TOKEN}`,
};

/**
 * Fake user login
 */
Cypress.Commands.add('fakeLogin', () => {
  window.localStorage.setItem(
    'authState',
    JSON.stringify({
      isLoading: false,
      error: false,
      isAuthenticated: true,
      apiToken: FAKE_API_TOKEN,
      user: {
        name: 'Test User',
      },
    })
  );
  window.localStorage.setItem('site-tour', -1);
});

/**
 * Stub network requests
 */
Cypress.Commands.add('startServer', () => {
  // GET /health
  cy.intercept(
    {
      host: restApiEndpoint,
      path: '/health',
    },
    { fixture: 'server/health.json' }
  );

  // GET /api
  cy.intercept(
    {
      host: restApiEndpoint,
      path: '/api',
    },
    { fixture: 'server/api.json' }
  );

  // GET /api/mosaic
  cy.intercept(
    {
      host: restApiEndpoint,
      path: '/api/mosaic',
    },
    {
      fixture: 'server/api/mosaic.json',
    }
  );

  // GET /api/models
  cy.intercept(
    {
      host: restApiEndpoint,
      path: '/api/model',
      headers: authHeaders,
    },
    {
      fixture: 'server/api/model.json',
    }
  );

  // GET /api/models/1
  cy.intercept(
    {
      host: restApiEndpoint,
      path: '/api/model/1',
      headers: authHeaders,
    },
    {
      body: {
        id: 1,
        created: '2021-03-09T10:56:35.438Z',
        active: true,
        uid: 1,
        name: 'NAIP Supervised',
        model_type: 'pytorch_example',
        model_inputshape: [256, 256, 4],
        model_zoom: 17,
        storage: true,
        classes: [
          { name: 'No Data', color: '#62a092' },
          { name: 'Water', color: '#0000FF' },
          { name: 'Emergent Wetlands', color: '#008000' },
          { name: 'Tree Canopy', color: '#80FF80' },
          { name: 'Shrubland', color: '#806060' },
          { name: 'Low Vegetation', color: '#07c4c5' },
          { name: 'Barren', color: '#027fdc' },
          { name: 'Structure', color: '#f76f73' },
          { name: 'Impervious Surface', color: '#ffb703' },
          { name: 'Impervious Road', color: '#0218a2' },
        ],
        meta: {},
        bounds: [null, null, null, null],
      },
    }
  );

  // GET /api/project
  cy.intercept(
    {
      host: restApiEndpoint,
      path: '/api/project',
      headers: authHeaders,
    },
    {
      body: {
        total: 3,
        projects: [
          { id: 1, name: 'Untitled', created: '2021-01-19T12:47:07.838Z' },
          { id: 2, name: 'Untitled', created: '2021-02-19T12:47:07.838Z' },
          { id: 3, name: 'Untitled', created: '2021-03-19T12:47:07.838Z' },
        ],
      },
    }
  );

  // GET /api/project/1
  cy.intercept(
    {
      host: restApiEndpoint,
      path: '/api/project/1',
      headers: authHeaders,
    },
    {
      body: {
        id: 1,
        name: 'Untitled',
        model_id: 1,
        mosaic: 'naip.latest',
        created: '2021-03-19T12:47:07.838Z',
      },
    }
  );

  // GET /api/project/1/aoi
  cy.intercept(
    {
      host: restApiEndpoint,
      path: '/api/project/1/aoi',
      headers: authHeaders,
    },
    {
      body: {
        total: 1,
        project_id: 1,
        aois: [
          {
            id: 1,
            name: 'A name',
            created: '2021-03-18T18:42:42.224Z',
            storage: true,
          },
        ],
      },
    }
  );

  // GET /api/project/1/aoi/1
  cy.intercept(
    {
      host: restApiEndpoint,
      path: '/api/project/1/aoi/1',
      headers: authHeaders,
    },
    {
      body: {
        id: 1,
        name: 'A name',
        created: '2021-03-18T18:44:10.879Z',
        storage: true,
        project_id: 1,
        checkpoint_id: 57,
        bounds: {
          type: 'Polygon',
          coordinates: [
            [
              [-79.365234375, 38.829010198],
              [-79.365234375, 38.84398613],
              [-79.387207031, 38.84398613],
              [-79.387207031, 38.829010198],
              [-79.365234375, 38.829010198],
            ],
          ],
        },
      },
    }
  );

  // GET /api/project/1/instance
  cy.intercept(
    {
      host: restApiEndpoint,
      path: '/api/project/1/instance/?status=active',
      headers: authHeaders,
    },
    {
      body: {
        id: 170,
        project_id: 118,
        aoi_id: null,
        checkpoint_id: null,
        last_update: '2021-03-22T10:57:17.080Z',
        created: '2021-03-22T10:57:17.080Z',
        active: false,
        token: 'FAKE_INSTANCE_TOKEN',
        pod: {
          apiVersion: 'v1',
          kind: 'Pod',
          metadata: {
            annotations: { 'janitor/ttl': '1h' },
            creationTimestamp: '2021-03-22T10:57:17.000Z',
            managedFields: [
              {
                apiVersion: 'v1',
                fieldsType: 'FieldsV1',
                fieldsV1: {
                  'f:metadata': {
                    'f:annotations': { '.': {}, 'f:janitor/ttl': {} },
                  },
                  'f:spec': {
                    'f:containers': {
                      'k:{"name":"gpu-170"}': {
                        '.': {},
                        'f:env': {
                          '.': {},
                          'k:{"name":"API"}': {
                            '.': {},
                            'f:name': {},
                            'f:value': {},
                          },
                          'k:{"name":"INSTANCE_ID"}': {
                            '.': {},
                            'f:name': {},
                            'f:value': {},
                          },
                          'k:{"name":"NVIDIA_DRIVER_CAPABILITIES"}': {
                            '.': {},
                            'f:name': {},
                            'f:value': {},
                          },
                          'k:{"name":"SOCKET"}': {
                            '.': {},
                            'f:name': {},
                            'f:value': {},
                          },
                          'k:{"name":"SigningSecret"}': {
                            '.': {},
                            'f:name': {},
                            'f:value': {},
                          },
                        },
                        'f:image': {},
                        'f:imagePullPolicy': {},
                        'f:name': {},
                        'f:resources': {
                          '.': {},
                          'f:limits': { '.': {}, 'f:nvidia.com/gpu': {} },
                          'f:requests': { '.': {}, 'f:nvidia.com/gpu': {} },
                        },
                        'f:terminationMessagePath': {},
                        'f:terminationMessagePolicy': {},
                      },
                    },
                    'f:dnsPolicy': {},
                    'f:enableServiceLinks': {},
                    'f:nodeSelector': { '.': {}, 'f:agentpool': {} },
                    'f:restartPolicy': {},
                    'f:schedulerName': {},
                    'f:securityContext': {},
                    'f:terminationGracePeriodSeconds': {},
                  },
                },
                manager: 'unknown',
                operation: 'Update',
                time: '2021-03-22T10:57:17.000Z',
              },
            ],
            name: 'lulc-staging-lulc-helm-gpu-170',
            namespace: 'default',
            resourceVersion: '13171663',
            selfLink:
              '/api/v1/namespaces/default/pods/lulc-staging-lulc-helm-gpu-170',
            uid: 'fe8337a0-73c6-4c08-9e48-6e346f00e2e4',
          },
          spec: {
            containers: [
              {
                env: [
                  { name: 'INSTANCE_ID', value: '170' },
                  { name: 'API', value: 'https://api.lulc-staging.ds.io' },
                  {
                    name: 'SOCKET',
                    value: 'ws://lulc-staging-lulc-helm-socket',
                  },
                  { name: 'SigningSecret', value: 'fY74Vf4@yKvreF' },
                  {
                    name: 'NVIDIA_DRIVER_CAPABILITIES',
                    value: 'compute,utility',
                  },
                ],
                image: 'lulcstagingacr.azurecr.io/lulc-gpu:0.0.1-n994.hc5b037e',
                imagePullPolicy: 'IfNotPresent',
                name: 'gpu-170',
                resources: {
                  limits: { 'nvidia.com/gpu': '1' },
                  requests: { 'nvidia.com/gpu': '1' },
                },
                terminationMessagePath: '/dev/termination-log',
                terminationMessagePolicy: 'File',
                volumeMounts: [
                  {
                    mountPath: '/var/run/secrets/kubernetes.io/serviceaccount',
                    name: 'default-token-zbfzs',
                    readOnly: true,
                  },
                ],
              },
            ],
            dnsPolicy: 'ClusterFirst',
            enableServiceLinks: true,
            nodeSelector: { agentpool: 'gpunodepool' },
            priority: 1,
            priorityClassName: 'normal',
            restartPolicy: 'Never',
            schedulerName: 'default-scheduler',
            securityContext: {},
            serviceAccount: 'default',
            serviceAccountName: 'default',
            terminationGracePeriodSeconds: 30,
            tolerations: [
              {
                effect: 'NoExecute',
                key: 'node.kubernetes.io/not-ready',
                operator: 'Exists',
                tolerationSeconds: 300,
              },
              {
                effect: 'NoExecute',
                key: 'node.kubernetes.io/unreachable',
                operator: 'Exists',
                tolerationSeconds: 300,
              },
            ],
            volumes: [
              {
                name: 'default-token-zbfzs',
                secret: { defaultMode: 420, secretName: 'default-token-zbfzs' },
              },
            ],
          },
          status: { phase: 'Pending', qosClass: 'BestEffort' },
        },
      },
    }
  );
});
