/*
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Runs the order summary example of the catalog end to end: the example messages go through
 * the `MessageProcessor` with the composed catalog, the `McpApp` renders through the real
 * sandbox proxy, and the test plays the agent, answering the `get_order` action by writing the
 * order to the data model and typing a discount code the way the sibling `TextField` would.
 */

import example from '../../../../../catalogs/mcp/v1/examples/mcp-app-order-summary.json' with {type: 'json'};
import {resetSandboxConfig} from '../../src/shared/sandbox/sandbox_config.js';
import {
  FrameTestHarness,
  parseExampleMessages,
  waitFor,
} from '../../src/v1_0/testing/frame_test_support.js';

const SURFACE_ID = 'gallery-mcp-app-order-summary';
const APP_ID = 'order_app';

describe('the order summary example', () => {
  let harness: FrameTestHarness;

  beforeEach(async () => {
    harness = new FrameTestHarness(SURFACE_ID, parseExampleMessages(example));
    await harness.renderComponent(APP_ID);
  });

  afterEach(() => {
    harness.dispose();
    resetSandboxConfig();
  });

  function total(): unknown {
    return harness.surface.dataModel.get('/order/total');
  }

  it('asks for the order through the get_order tool and totals the seeded items', async () => {
    const call = await harness.nextAction('get_order');
    expect(call.sourceComponentId).toBe(APP_ID);
    expect(call.context).toEqual({orderId: 'A-1042'});

    await waitFor(() => total() === 90, 'total written by the app');
    expect(harness.actionsNamed('get_order').length).toBe(1);
  });

  it('applies the discount code typed in the sibling text field', async () => {
    await waitFor(() => total() === 90, 'total written by the app');

    harness.setData('/order/discountCode', 'SAVE10');

    await waitFor(() => total() === 81, 'discounted total written by the app');
  });

  it('delivers ontoolresult structuredContent to budget_app and syncs updated summary', async () => {
    await harness.renderComponent('budget_app');
    harness.setData('/budget/stage', 'Series A');

    await waitFor(
      () => String(harness.surface.dataModel.get('/budget/summary') ?? '').startsWith('Series A:'),
      'updated budget summary written by budget_app',
    );
  });
});
