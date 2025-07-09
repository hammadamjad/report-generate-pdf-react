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
  paddingBottom: 100,
  paddingTop: 100,
  paddingHorizontal: 40,
  // backgroundColor: '#b7d7db',
  fontSize: 10,
  fontFamily: 'Helvetica',
  borderWidth: 2,                 
  borderColor: '#ADD8E6',          
  borderStyle: 'solid',            
  width: '100%',
  height: '100%',
},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom:2
	},
	storeInfo: {
		flexDirection: 'column',
		fontSize:12,
		gap:0.5
	},
	affiliateInfo: {
		paddingTop:8,
		fontSize: 12,
		gap:0.5,
		 
		flexDirection: 'column',
		alignItems: 'flex-start'
	},
	bold: {
		 fontFamily: 'Helvetica-Bold'
	},
	tealText: {
  color: '#008080',  
},
	section: {
		marginVertical: 6,
		fontSize:12,
		marginTop:8
		

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
	//	width: ,
		marginBottom: 2
	},
	tableRow: {
		 
		flexDirection: 'row'
	},
	tableCell: {
		padding: 5,
		gap:3
		// borderBottom: '0.4pt solid black'
	},
	tableHeader: {
		 fontFamily: 'Helvetica-Bold'
	},
	totalRow: {
		backgroundColor: '#b7d7db',
		borderRadius: 20,
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
		fontSize: 14,
	},
});

// Header Component with Inline Styling
// Header Component with box + divider line
function HeaderComponent({ title }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
      }}
    >
      {/* Text inside a tight box */}
      <View
        style={{
          border: '2pt solid black',
          paddingTop: 4,
          paddingBottom: 4,
          paddingLeft: 8,
          paddingRight: 8,
          alignSelf: 'flex-start',
        }}
      >
        <Text
          style={{
            fontSize: 12,
             fontFamily: 'Helvetica-Bold',
          }}
        >
          {title}
        </Text>
      </View>

      {/* Horizontal line that fills the remaining space */}
      <View
        style={{
          height: 1,
          backgroundColor: 'black',
          flex: 1,
          marginLeft: 10,
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
								fontSize: 14,
								// fontFamily: 'Helvetica',
								fontFamily:'Helvetica-Bold',
								 fontWeight: 'normal',
								textAlign: 'center',
								marginTop: 60,
							
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
						src="logo.png" alt="glasses"
						style={{ width: 73, height: 73}}
						/>
						<Text style={{ marginTop: 3 }}>{statementData.store_info.name}</Text>
						<Text style={{width:140}}>{statementData.store_info.address}</Text>
						 

					</View>
					<View style={styles.affiliateInfo}>
						<Text style={styles.bold}>Affiliate information:</Text>
						<Text>{statementData.affiliate.name}</Text>
						<Text>{statementData.affiliate.address || 'N/A'}</Text>
						 
						<Text>{statementData.affiliate.email}</Text>
						<Text>SSN:***_***-7414</Text>
					</View>
				</View>

				{/* Earnings Period */}
				<Text style={[styles.bold, { marginLeft: 20, marginTop: 20, width: '100%', textAlign: 'center', fontSize: 14 }]}>
					{format(new Date(statementData.statement_info.payout_from * 1000), 'MMM dd, yyyy')} -{' '}
					{format(new Date(statementData.statement_info.payout_to * 1000), 'MMM dd, yyyy')} Earnings Period
				</Text>



				{/* Payout Summary */}
				<View style={styles.section}>
					<HeaderComponent title="Payout Summary" />
					<View style={styles.table}>
						<View style={[styles.tableRow, styles.tableHeader]}>
							<Text style={[styles.tableCell, { width: '35%' }]} />
							<Text style={[styles.tableCell, { width: '22%' }]}>Instances</Text>
							<Text style={[styles.tableCell, { width: '5%' }]}>Amount</Text>
						</View>
						<View style={styles.tableRow}>
							<Text style={[styles.tableCell, { width: '36%' }]}>Monthly renewals:</Text>
							<Text style={[styles.tableCell, { width: '21%' }]}>
								{statementData.payout_summary.monthly.instances}
							</Text>
							<Text style={[styles.tableCell, { width: '25%' }]}>
								${statementData.payout_summary.monthly.amount.toFixed(2)}
							</Text>
						</View>
						<View style={styles.tableRow}>
							<Text style={[styles.tableCell, { width: '36%' }]}>Annual renewals:</Text>
							<Text style={[styles.tableCell, { width: '21%' }]}>
								{statementData.payout_summary.yearly.instances}
							</Text>
							<Text style={[styles.tableCell, { width: '25%' }]}>
								${statementData.payout_summary.yearly.amount.toFixed(2)}
							</Text>
						</View>
						<View style={styles.tableRow}>
							<Text style={[styles.tableCell, { width: '36%' }]}>Bounties:</Text>
							<Text style={[styles.tableCell, { width: '21%' }]}>
								{statementData.payout_summary.bounties.instances}
							</Text>
							<Text style={[styles.tableCell, { width: '25%' }]}>
								${statementData.payout_summary.bounties.amount.toFixed(2)}
							</Text>
						</View>
						 
					 	 <View style={{ marginTop: 4, marginBottom: 4 }}>
						{/* Top short black line same width as teal box */}
						<View
							style={{
							width: 250, // Match or slightly larger than the teal box width
							height: 1,
							backgroundColor: 'black',
							marginBottom: 5,
							marginLeft:105,
							}}
						/>

						{/* Teal Box + Right Side Line */}
						<View
							style={{
							flexDirection: 'row',
							alignItems: 'center',
							}}
						>
							{/* Teal Pill Box */}
							<View
							style={{
								flexDirection: 'row',
								backgroundColor: '#b7d7db',
								borderRadius: 20,
								paddingVertical: 6,
								paddingHorizontal: 10,
								gap: 200,
							}}
							>
							<Text
								style={{
								 fontFamily: 'Helvetica-Bold',
								fontSize: 12,
								color: 'black',
								}}
							>
								Total payout:
							</Text>
							<Text
								style={{
								 fontFamily: 'Helvetica-Bold',
								fontSize: 12,
								color: 'black',
								}}
							>
								${statementData.payout_summary.total_payout.toFixed(2)}
							</Text>
							</View>

							{/* Extending Line to Right */}
							<View
							
							/>
						</View>
						</View>



					</View>
				</View>




				{/* Monthly Renewal Summary */}
				<View style={styles.section}>
					<HeaderComponent title="Monthly Renewal Summary"  width='300px'/>
					<View style={styles.table}>
						<View style={[styles.tableRow, styles.tableHeader]}>
							<Text style={[styles.tableCell, { width: '185%' }]}>Date</Text>
							<Text style={[styles.tableCell, { width: '110%' }]}>Customer name</Text>
							<Text style={[styles.tableCell, { width: '33%' }]}>Payout</Text>
						</View>
						{statementData.monthly_summary.map((item, idx) => (
							<View
								key={idx}
								style={styles.tableRow}
							>
								<Text style={[styles.tableCell, { width: '193%' }]}>
									{format(new Date(item.date * 1000), 'MMM dd, yyyy')}
								</Text>
								<Text style={[styles.tableCell, { width: '115%' }]}>{item.customer_name}</Text>
								<Text style={[styles.tableCell, { width: '33%' }]}>${item.amount.toFixed(2)}</Text>
							</View>
						))}
					</View>
				</View>



				{/* Yearly Renewal Summary */}
				<View style={styles.section}>
					<HeaderComponent title="Annual Renewal Summary" />
					<View style={styles.table}>
						<View style={[styles.tableRow, styles.tableHeader]}>
							<Text style={[styles.tableCell, { width: '183%' }]}>Date</Text>
							<Text style={[styles.tableCell, { width: '110%' }]}>Customer name</Text>
							<Text style={[styles.tableCell, { width: '33%' }]}>Payout</Text>
						</View>
						{statementData.yearly_summary.map((item, idx) => (
							<View
								key={idx}
								style={styles.tableRow}
							>
								<Text style={[styles.tableCell, { width: '193%' }]}>
									{format(new Date(item.date * 1000), 'MMM dd, yyyy')}
								</Text>
								<Text style={[styles.tableCell, { width: '115%' }]}>{item.customer_name}</Text>
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
							<Text style={[styles.tableCell, { width: '183%' }]}>Date</Text>
							<Text style={[styles.tableCell, { width: '110%' }]}>Customer name</Text>
							<Text style={[styles.tableCell, { width: '33%' }]}>Payout</Text>
						</View>
						{statementData.bounties_summary.map((item, idx) => (
							<View
								key={idx}
								style={styles.tableRow}
							>
								<Text style={[styles.tableCell, { width: '193%' }]}>
									{format(new Date(item.date * 1000), 'MMM dd, yyyy')}
								</Text>
								<Text style={[styles.tableCell, { width: '115%' }]}>{item.customer_name}</Text>
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