// Import required libraries
const otel = require('./otel')
const pino = require('pino');


// Initialize Pino logger
const logger = pino({
  level: 'info',
  transport: {
    target: 'pino-pretty',
  },
});

// Payment processing simulation
const processors = [
  { id: 'processor-1', name: 'Stripe' },
  { id: 'processor-2', name: 'PayPal' },
  { id: 'processor-3', name: 'Square' },
  { id: 'processor-4', name: 'Adyen' },
  { id: 'processor-5', name: 'Worldpay' },
  { id: 'processor-6', name: 'Authorize.Net' },
  { id: 'processor-7', name: 'Braintree' },
  { id: 'processor-8', name: 'Klarna' },
  { id: 'processor-9', name: '2Checkout' },
  { id: 'processor-10', name: 'Amazon Pay' },
];

const failureInterval = 4 * 60 * 1000; // Every 4 minutes
const failureDuration = 2 * 60 * 1000; // Lasting 2 minute
let failingProcessor = null;

function getRandomProcessor() {
  return processors[Math.floor(Math.random() * processors.length)];
}

function getRandomCustomer() {
  const customerId = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  const customerName = `Customer-${customerId}`;
  return { customerId, customerName };
}

function logPayment(processor, status, message) {
  const { customerId, customerName } = getRandomCustomer();
  const logEntry = {
    timestamp: new Date().toISOString(),
    processorName: processor.name,
    status,
    customerName,
    platform: 'payments',
  };
  if(status === "SUCCESS") {
    logger.info(logEntry, message);
  } else {
    logger.error(logEntry, message);
  }
  
}

function simulatePayments() {
  setInterval(() => {
    processors.forEach((processor) => {
      const isFailing = processor === failingProcessor;
      const status = isFailing ? 'FAILED' : 'SUCCESS';
      const message = isFailing
        ? `Payment failed for processor ${processor.name}`
        : `Payment processed successfully by ${processor.name}`;

      logPayment(processor, status, message);
    });
  }, 6000 / processors.length); // Generate ~100 logs per minute, evenly distributed
}

function simulateProcessorFailures() {
  setInterval(() => {
    failingProcessor = getRandomProcessor();
    logger.error({
      timestamp: new Date().toISOString(),
      event: 'failure-start',
      processorName: failingProcessor.name,
      platform: 'checkout.com',
    }, `Processor ${failingProcessor.name} starts failing.`);

    setTimeout(() => {
      logger.info({
        timestamp: new Date().toISOString(),
        event: 'failure-end',
        processorName: failingProcessor.name,
        platform: 'checkout.com',
      }, `Processor ${failingProcessor.name} recovered.`);
      failingProcessor = null;
    }, failureDuration);
  }, failureInterval);
}

// Start simulation
simulatePayments();
simulateProcessorFailures();
