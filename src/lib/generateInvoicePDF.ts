import React from 'react';
import { Document, Page, Text, View, StyleSheet, renderToBuffer } from '@react-pdf/renderer';

const GOLD = '#B8972A';
const DARK = '#1a1a1a';
const GRAY = '#666666';
const LIGHT = '#f5f5f5';
const WHITE = '#ffffff';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: DARK,
    backgroundColor: WHITE,
    padding: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: GOLD,
  },
  companyName: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: GOLD,
    letterSpacing: 1,
  },
  companyTagline: {
    fontSize: 9,
    color: GRAY,
    marginTop: 2,
  },
  invoiceLabel: {
    fontSize: 26,
    fontFamily: 'Helvetica-Bold',
    color: DARK,
    textAlign: 'right',
  },
  invoiceNumber: {
    fontSize: 11,
    color: GRAY,
    textAlign: 'right',
    marginTop: 4,
  },
  invoiceDate: {
    fontSize: 10,
    color: GRAY,
    textAlign: 'right',
    marginTop: 2,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: GOLD,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  billTo: {
    backgroundColor: LIGHT,
    padding: 12,
    borderRadius: 4,
  },
  billToName: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: DARK,
    marginBottom: 4,
  },
  billToInfo: {
    fontSize: 10,
    color: GRAY,
    marginBottom: 2,
  },
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: GOLD,
    padding: 8,
  },
  tableHeaderText: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: WHITE,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  tableRowAlt: {
    flexDirection: 'row',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: LIGHT,
  },
  col1: { width: '40%' },
  col2: { width: '30%' },
  col3: { width: '30%', textAlign: 'right' },
  cellText: { fontSize: 10, color: DARK },
  cellTextGray: { fontSize: 10, color: GRAY },
  pricingSection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 16,
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  pricingLabel: { fontSize: 10, color: GRAY },
  pricingValue: { fontSize: 10, color: DARK },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: GOLD,
  },
  totalLabel: { fontSize: 13, fontFamily: 'Helvetica-Bold', color: DARK },
  totalValue: { fontSize: 13, fontFamily: 'Helvetica-Bold', color: GOLD },
  remainderBox: {
    backgroundColor: '#FFF8E1',
    borderWidth: 1,
    borderColor: GOLD,
    borderRadius: 4,
    padding: 10,
    marginTop: 12,
  },
  remainderText: { fontSize: 10, color: '#7A6020' },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: { fontSize: 8, color: GRAY },
  badge: {
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeText: { fontSize: 10, color: '#2E7D32', fontFamily: 'Helvetica-Bold' },
});

export interface InvoiceData {
  invoiceId: string;
  date: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  itemName: string;
  itemType: 'Car' | 'Hotel' | 'Apartment' | 'Villa';
  startDate: string;
  endDate: string;
  persons?: number;
  basePrice: number;
  paymentOptions: ('full' | 'deposit')[];
  fullAmount?: number;
  depositAmount?: number;
  remainderAmount?: number;
}

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return d;
  }
}

function calcNights(start: string, end: string): number {
  try {
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    return Math.max(1, Math.round((e - s) / (1000 * 60 * 60 * 24)));
  } catch {
    return 1;
  }
}

function InvoiceDocument(data: InvoiceData) {
  const nights = calcNights(data.startDate, data.endDate);
  const nightLabel = data.itemType === 'Car' ? 'day' : 'night';

  return React.createElement(
    Document,
    { title: `Invoice ${data.invoiceId}`, author: 'Shams Al Bosnia' },
    React.createElement(
      Page,
      { size: 'A4', style: styles.page },

      // Header
      React.createElement(
        View,
        { style: styles.header },
        React.createElement(
          View,
          null,
          React.createElement(Text, { style: styles.companyName }, 'SHAMS AL BOSNIA'),
          React.createElement(Text, { style: styles.companyTagline }, 'Luxury Travel & Car Rental • Sarajevo, Bosnia'),
        ),
        React.createElement(
          View,
          null,
          React.createElement(Text, { style: styles.invoiceLabel }, 'INVOICE'),
          React.createElement(Text, { style: styles.invoiceNumber }, data.invoiceId),
          React.createElement(Text, { style: styles.invoiceDate }, `Date: ${data.date}`),
        ),
      ),

      // Confirmed badge
      React.createElement(
        View,
        { style: styles.badge },
        React.createElement(Text, { style: styles.badgeText }, '✓  Booking Confirmed'),
      ),

      // Bill To
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, 'Bill To'),
        React.createElement(
          View,
          { style: styles.billTo },
          React.createElement(Text, { style: styles.billToName }, data.customerName),
          React.createElement(Text, { style: styles.billToInfo }, data.customerEmail),
          data.customerPhone
            ? React.createElement(Text, { style: styles.billToInfo }, data.customerPhone)
            : null,
        ),
      ),

      // Booking Details Table
      React.createElement(
        View,
        { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, 'Booking Details'),
        React.createElement(
          View,
          { style: styles.table },
          React.createElement(
            View,
            { style: styles.tableHeader },
            React.createElement(Text, { style: [styles.tableHeaderText, styles.col1] }, 'Description'),
            React.createElement(Text, { style: [styles.tableHeaderText, styles.col2] }, 'Period'),
            React.createElement(Text, { style: [styles.tableHeaderText, styles.col3] }, 'Duration'),
          ),
          React.createElement(
            View,
            { style: styles.tableRow },
            React.createElement(
              View,
              { style: styles.col1 },
              React.createElement(Text, { style: styles.cellText }, data.itemName),
              React.createElement(Text, { style: styles.cellTextGray }, data.itemType),
            ),
            React.createElement(
              View,
              { style: styles.col2 },
              React.createElement(Text, { style: styles.cellText }, formatDate(data.startDate)),
              React.createElement(Text, { style: styles.cellTextGray }, `→ ${formatDate(data.endDate)}`),
            ),
            React.createElement(
              View,
              { style: styles.col3 },
              React.createElement(Text, { style: styles.cellText }, `${nights} ${nightLabel}${nights > 1 ? 's' : ''}`),
              data.persons
                ? React.createElement(Text, { style: styles.cellTextGray }, `${data.persons} persons`)
                : null,
            ),
          ),
        ),
      ),

      // Pricing
      React.createElement(
        View,
        { style: styles.pricingSection },
        React.createElement(Text, { style: styles.sectionTitle }, 'Payment Summary'),

        React.createElement(
          View,
          { style: styles.pricingRow },
          React.createElement(Text, { style: styles.pricingLabel }, 'Base Price'),
          React.createElement(Text, { style: styles.pricingValue }, `${data.basePrice.toFixed(2)} EUR`),
        ),

        data.paymentOptions.includes('full') && data.fullAmount != null
          ? React.createElement(
              View,
              { style: styles.pricingRow },
              React.createElement(Text, { style: styles.pricingLabel }, 'Full Payment (5% discount applied)'),
              React.createElement(Text, { style: styles.pricingValue }, `${data.fullAmount.toFixed(2)} EUR`),
            )
          : null,

        data.paymentOptions.includes('deposit') && data.depositAmount != null
          ? React.createElement(
              View,
              { style: styles.pricingRow },
              React.createElement(Text, { style: styles.pricingLabel }, 'Deposit Required (10%)'),
              React.createElement(Text, { style: styles.pricingValue }, `${data.depositAmount.toFixed(2)} EUR`),
            )
          : null,

        React.createElement(
          View,
          { style: styles.totalRow },
          React.createElement(
            Text,
            { style: styles.totalLabel },
            data.paymentOptions.includes('full') && data.paymentOptions.includes('deposit')
              ? 'Amount Due (choose option below)'
              : data.paymentOptions.includes('full')
              ? 'Total Due (Full Payment)'
              : 'Deposit Due Now',
          ),
          React.createElement(
            Text,
            { style: styles.totalValue },
            data.paymentOptions.includes('full') && data.fullAmount != null
              ? `${data.fullAmount.toFixed(2)} EUR`
              : data.depositAmount != null
              ? `${data.depositAmount.toFixed(2)} EUR`
              : `${data.basePrice.toFixed(2)} EUR`,
          ),
        ),

        data.remainderAmount != null
          ? React.createElement(
              View,
              { style: styles.remainderBox },
              React.createElement(
                Text,
                { style: styles.remainderText },
                `Remaining balance of ${data.remainderAmount.toFixed(2)} EUR is due upon arrival.`,
              ),
            )
          : null,
      ),

      // Footer
      React.createElement(
        View,
        { style: styles.footer },
        React.createElement(
          View,
          null,
          React.createElement(Text, { style: styles.footerText }, 'Shams Al Bosnia D.O.O.'),
          React.createElement(Text, { style: styles.footerText }, 'Milana Perloga 14a, 71000 Sarajevo, Bosnia and Herzegovina'),
        ),
        React.createElement(
          View,
          null,
          React.createElement(Text, { style: styles.footerText }, 'info@shamsalbosnia.com'),
          React.createElement(Text, { style: styles.footerText }, '+387 65 339 886'),
        ),
      ),
    ),
  );
}

export async function generateInvoicePDF(data: InvoiceData): Promise<Buffer> {
  const doc = InvoiceDocument(data);
  return await renderToBuffer(doc);
}
