import React, { useState, useEffect } from 'react';
import { Document, Page, Text, View, StyleSheet, pdf, Image } from '@react-pdf/renderer';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { format } from 'date-fns';
// import './PayoutStatementPDF.css';

// Styles for the PDF
const styles = StyleSheet.create({
	page: {
		padding: 20,
		paddingBottom: 50,
		paddingTop: 80,
		fontSize: 14,
		fontFamily: 'Helvetica',
		border: '1pt solid black',
		width: '100%',
		height: '100%'
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 15
	},
	storeInfo: {
		flexDirection: 'column'
	},
	affiliateInfo: {
		flexDirection: 'column',
		alignItems: 'flex-end'
	},
	bold: {
		fontFamily: 'Helvetica-Bold'
	},
	section: {
		marginVertical: 10
	},
	heading: {
		fontSize: 14,
		fontFamily: 'Helvetica-Bold',
		marginBottom: 2
	},
	underline: {
		borderBottom: '0.4pt solid black',
		width: '25%',
		marginBottom: 10
	},
	table: {
		width: 'auto',
		marginBottom: 10
	},
	tableRow: {
		flexDirection: 'row'
	},
	tableCell: {
		padding: 5,
		// borderBottom: '0.4pt solid black'
	},
	tableHeader: {
		fontFamily: 'Helvetica-Bold'
	},
	totalRow: {
		backgroundColor: '#b7d7db',
		borderRadius: 10,
		padding: 5
	},
	customHeader: {
		position: 'absolute',
		top: 20,
		left: 0,
		right: 0,
		// paddingBottom: 200,
		// borderBottom: '0.4pt solid black',
		flexDirection: 'row',
		justifyContent: 'space-between',
		fontSize: 12,
	},
});

// Header Component with Inline Styling
function HeaderComponent({ title, width }) {
	return (
	<View
	  style={{
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		gap: 20, // Matches gap-5 (approximated as 20pt in PDF context)
	  }}
	>
	  <View
		style={{
		  padding: 10, // Matches p-5 (approximated as 20pt in PDF context)
		  borderWidth: 2,
		  borderColor: 'black',
		  ...(width ? { width } : { width: '300px' }),
		}}
	  >
		<Text
		  style={{
			fontSize: 12, // Matches Typography variant="body1" (approximate size)
			fontFamily: 'Helvetica-Bold', // Matches fontWeight="bold"
		  }}
		>
		  {title}
		</Text>
	  </View>
	  <View
		style={{
		  height: 2,
		  backgroundColor: 'black',
		  width: '100%',
		}}
	  />
	</View>
  );
}

// PDF Document Component
function PdfDocument({ statementData }) {
	return (
		<Document>
			<Page
				size="A4"
				style={styles.page}
			>
				{/* Custom Header for all pages except the first */}
				<View
					style={styles.customHeader}
					fixed
					render={({ pageNumber }) =>
						pageNumber > 1 ? (
							
							<Text style={{
								fontSize: 18,
								fontFamily: 'Helvetica',
								fontWeight: 'bold',
								textAlign: 'center',
								marginBottom: 100,
								width: '100%'
							}}>
								Earnings Period: {format(new Date(statementData.statement_info.payout_from * 1000), 'MMM dd, yyyy')} -{' '}
								{format(new Date(statementData.statement_info.payout_to * 1000), 'MMM dd, yyyy')}
							</Text>
						) : null
					}
				/>

				{/* First Page Header */}
				<View style={styles.header}>
					<View style={styles.storeInfo}>
						{/* Logo placeholder */}
						<Image
							src="/assets/images/logo/logo.png" // Adjust the path as needed
							style={{ width: 60, height: 60, marginBottom: 5 }}
						/>
						<Text style={{ marginTop: 5 }}>{statementData.store_info.name}</Text>
						<Text>{statementData.store_info.address}</Text>
					</View>
					<View style={styles.affiliateInfo}>
						<Text style={styles.bold}>Affiliate information:</Text>
						<Text>{statementData.affiliate.name}</Text>
						<Text>{statementData.affiliate.address || 'N/A'}</Text>
						<Text>{statementData.affiliate.email}</Text>
						<Text>SSN: [Redacted]</Text>
					</View>
				</View>

				{/* Earnings Period */}
				<Text style={[styles.bold, { marginBottom: 15, width: '100%', textAlign: 'center', fontSize: 18, marginTop: 50 }]}>
					{format(new Date(statementData.statement_info.payout_from * 1000), 'MMM dd, yyyy')} -{' '}
					{format(new Date(statementData.statement_info.payout_to * 1000), 'MMM dd, yyyy')} Earnings Period
				</Text>

				{/* Payout Summary */}
				<View style={styles.section}>
					<HeaderComponent title="Payout Summary" />
					<View style={styles.table}>
						<View style={[styles.tableRow, styles.tableHeader]}>
							<Text style={[styles.tableCell, { width: '50%' }]} />
							<Text style={[styles.tableCell, { width: '25%' }]}>Instances</Text>
							<Text style={[styles.tableCell, { width: '25%' }]}>Amount</Text>
						</View>
						<View style={styles.tableRow}>
							<Text style={[styles.tableCell, { width: '50%' }]}>Monthly renewals:</Text>
							<Text style={[styles.tableCell, { width: '25%' }]}>
								{statementData.payout_summary.monthly.instances}
							</Text>
							<Text style={[styles.tableCell, { width: '25%' }]}>
								${statementData.payout_summary.monthly.amount.toFixed(2)}
							</Text>
						</View>
						<View style={styles.tableRow}>
							<Text style={[styles.tableCell, { width: '50%' }]}>Annual renewals:</Text>
							<Text style={[styles.tableCell, { width: '25%' }]}>
								{statementData.payout_summary.yearly.instances}
							</Text>
							<Text style={[styles.tableCell, { width: '25%' }]}>
								${statementData.payout_summary.yearly.amount.toFixed(2)}
							</Text>
						</View>
						<View style={styles.tableRow}>
							<Text style={[styles.tableCell, { width: '50%' }]}>Bounties:</Text>
							<Text style={[styles.tableCell, { width: '25%' }]}>
								{statementData.payout_summary.bounties.instances}
							</Text>
							<Text style={[styles.tableCell, { width: '25%' }]}>
								${statementData.payout_summary.bounties.amount.toFixed(2)}
							</Text>
						</View>
						<View style={[styles.tableRow, styles.totalRow, { borderBottom: 'none' }]}>
							<Text style={[styles.tableCell, styles.bold, { width: '50%' }]}>Total payout:</Text>
							<Text style={[styles.tableCell, { width: '25%' }]} />
							<Text style={[styles.tableCell, styles.bold, { width: '25%' }]}>
								${statementData.payout_summary.total_payout.toFixed(2)}
							</Text>
						</View>
					</View>
				</View>

				{/* Monthly Renewal Summary */}
				<View style={styles.section}>
					<HeaderComponent title="Monthly Renewal Summary"  width='300px'/>
					{/* <Text style={styles.heading}>Monthly Renewal Summary</Text> */}
					{/* <View style={[styles.underline, { width: '35%' }]} /> */}
					<View style={styles.table}>
						<View style={[styles.tableRow, styles.tableHeader]}>
							<Text style={[styles.tableCell, { width: '33%' }]}>Date</Text>
							<Text style={[styles.tableCell, { width: '34%' }]}>Customer name</Text>
							<Text style={[styles.tableCell, { width: '33%' }]}>Payout</Text>
						</View>
						{statementData.monthly_summary.map((item, idx) => (
							<View
								key={idx}
								style={styles.tableRow}
							>
								<Text style={[styles.tableCell, { width: '33%' }]}>
									{format(new Date(item.date * 1000), 'MMM dd, yyyy')}
								</Text>
								<Text style={[styles.tableCell, { width: '34%' }]}>{item.customer_name}</Text>
								<Text style={[styles.tableCell, { width: '33%' }]}>${item.amount.toFixed(2)}</Text>
							</View>
						))}
					</View>
				</View>

				{/* Yearly Renewal Summary */}
				<View style={styles.section}>
					<HeaderComponent title="Annual Renewal Summary" />
					{/* <Text style={styles.heading}>Yearly Renewal Summary</Text> */}
					{/* <View style={[styles.underline, { width: '35%' }]} /> */}
					<View style={styles.table}>
						<View style={[styles.tableRow, styles.tableHeader]}>
							<Text style={[styles.tableCell, { width: '33%' }]}>Date</Text>
							<Text style={[styles.tableCell, { width: '34%' }]}>Customer name</Text>
							<Text style={[styles.tableCell, { width: '33%' }]}>Payout</Text>
						</View>
						{statementData.yearly_summary.map((item, idx) => (
							<View
								key={idx}
								style={styles.tableRow}
							>
								<Text style={[styles.tableCell, { width: '33%' }]}>
									{format(new Date(item.date * 1000), 'MMM dd, yyyy')}
								</Text>
								<Text style={[styles.tableCell, { width: '34%' }]}>{item.customer_name}</Text>
								<Text style={[styles.tableCell, { width: '33%' }]}>${item.amount.toFixed(2)}</Text>
							</View>
						))}
					</View>
				</View>

				{/* Bounties Summary */}
				<View style={styles.section}>
					<HeaderComponent title="Bounties" />
					{/* <Text style={styles.heading}>Bounties</Text> */}
					{/* <View style={[styles.underline, { width: '15%' }]} /> */}
					<View style={styles.table}>
						<View style={[styles.tableRow, styles.tableHeader]}>
							<Text style={[styles.tableCell, { width: '33%' }]}>Date</Text>
							<Text style={[styles.tableCell, { width: '34%' }]}>Customer name</Text>
							<Text style={[styles.tableCell, { width: '33%' }]}>Payout</Text>
						</View>
						{statementData.bounties_summary.map((item, idx) => (
							<View
								key={idx}
								style={styles.tableRow}
							>
								<Text style={[styles.tableCell, { width: '33%' }]}>
									{format(new Date(item.date * 1000), 'MMM dd, yyyy')}
								</Text>
								<Text style={[styles.tableCell, { width: '34%' }]}>{item.customer_name}</Text>
								<Text style={[styles.tableCell, { width: '33%' }]}>${item.amount.toFixed(2)}</Text>
							</View>
						))}
					</View>
				</View>
				<Text
					style={{
						position: 'absolute',
						fontSize: 10,
						bottom: 20,
						right: 30,
						textAlign: 'right',
						width: 100,
					}}
					fixed
					render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
				/>
			</Page>
		</Document>
	);
}

function PayoutStatementPDF({ statementData }) {
	// print("statement data: ",statementData)
	const [pdfUrl, setPdfUrl] = useState(null);

	const generatePdf = async () => {
		try {
			const blob = await pdf(<PdfDocument statementData={statementData} />).toBlob();
			const url = URL.createObjectURL(blob);
			setPdfUrl(url)
			if (url && statementData) {
				const title = `${format(new Date(statementData.statement_info.payout_date * 1000), 'MMM dd, y')} - ${statementData.affiliate.name} Affiliate Statement`;
				const filename = `${title}.pdf`.replace(/[^a-zA-Z0-9\-. ]/g, '');
				const response = await fetch(pdfUrl);
				const blob = await response.blob();
				const blobUrl = URL.createObjectURL(blob);
				// Download the file with the correct filename
				const a = document.createElement('a');
				a.href = blobUrl;
				a.download = filename;
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
				// Print directly
				const printWindow = window.open(blobUrl, '_blank');
				if (printWindow) {
					printWindow.onload = () => {
						printWindow.document.title = filename;
						printWindow.focus();
						printWindow.print();
						setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
					};
				}
			}
			// if (onPdfReady) onPdfReady(url); // Notify parent
		} catch (error) {
			console.error('Error generating PDF:', error);
		}
	};
	useEffect(() => {
		
		return () => {
			if (pdfUrl) URL.revokeObjectURL(pdfUrl);
		};
	}, [pdfUrl]);

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				width: '100%',
				maxWidth: '800px',
				margin: '0 auto'
			}}
		>
			<div>
				<button 
				onClick={generatePdf}
				style={{
					background:"black",
					padding: 10,
					color:"white",

				}} >Print Here</button>
			</div>
			{pdfUrl ? (
				<Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
					<Viewer
						fileUrl={pdfUrl}
						plugins={[]}
					/>
				</Worker>
			) : (
				<div>Loading PDF...</div>
			)}
		</div>
	);
}

export default PayoutStatementPDF;