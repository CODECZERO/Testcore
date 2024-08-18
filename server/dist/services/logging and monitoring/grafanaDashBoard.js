var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from "axios";
const grafanaUrl = 'https://prometheus-prod-43-prod-ap-south-1.grafana.net/api/prom/push'; // Grafana URL
const apiKey = ' glc_eyJvIjoiMTE5OTAxOCIsIm4iOiJzdGglc_eyJvIjoiMTE5OTAxOCIsIm4iOiJzdGFjay0xMDEzOTczLWludGVncmF0aW9uLXRlc3QiLCJrIjoic3ByMDE1MTltOVppb0dGN1dWOVk2cEEyIiwibSI6eyJyIjoicHJvZC1hcC1zb3V0aC0xIn19Fjay0xMDEzOTczLWludGVncmF0aW9uLXRlc3QiLCJrIjoic3ByMDE1MTltOVppb0dGN1dWOVk2cEEyIiwibSI6eyJyIjoicHJvZC1hcC1zb3V0aC0xIn19'; // Replace with your Grafana API key
// Example dashboard config
const dashboardConfig = {
    title: 'Node.js Application Dashboard',
    panels: [
        {
            title: 'Request Count',
            type: 'graph',
            targets: [
                {
                    expr: 'node_request_count',
                    legendFormat: '{{le}}',
                },
            ],
        },
    ],
};
const headers = {
    'Authorization': `Bearer ${apiKey}`
};
const createDashboard = (dashboardConfig) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios.post(`${grafanaUrl}/dashboards/db`, dashboardConfig, { headers });
        console.log('Dashboard created:', response.data);
    }
    catch (error) {
        console.error('Error creating dashboard:', error);
    }
});
export { createDashboard, dashboardConfig };
