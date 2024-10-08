import socket
from datetime import datetime, date, timedelta
import time
import xmltodict
import json
import pyodbc
import os
import xml.dom.minidom

# Define the controller's IP address and port
HOST = '192.168.2.218'
PORT = 4710  # Replace with the actual port number

RequestID = 0
ApplicationSender = "POSsell1"
WorkstationID = "POS001"


def connectionsConfig():
    server = ''
    database = ''
    username = ''
    password = ''
    driver_number = ''
    
    DOMTree = xml.dom.minidom.parse("DBConfig.xml")
    collection = DOMTree.documentElement
    if collection.hasAttribute("shelf"):
        with open('connection_status.log', 'a') as f:
                f.write('Info: Root element readed successfully from DBConfig.xml .... '+ time.strftime("%Y-%m-%d_%H-%M-%S", time.localtime())+'\n')
    Configurations = collection.getElementsByTagName("Configuration")
    for Configuration in Configurations:
        if Configuration.hasAttribute("title"):    
            if Configuration.getAttribute("title")=="ServerConnection":
                server = Configuration.getAttribute("server")
                database = Configuration.getAttribute("database")
                username = Configuration.getAttribute("username")
                password = Configuration.getAttribute("password")
                driver_number = Configuration.getAttribute("driver_number")
        else:
            with open('connection_status.log', 'a') as f:
                f.write('Error: Configuration Title is not found at DBConfig.xml ...! '+ time.strftime("%Y-%m-%d_%H-%M-%S", time.localtime())+'\n')

    cnxn = pyodbc.connect("DRIVER={ODBC Driver "+driver_number+" for SQL Server};SERVER="+
                    server+";DATABASE="+
                    database+";UID="+
                    username+";PWD="+
                    password)
    
    print("connected to GTSHO DB")
    with open('connection_status.log', 'a') as f:
        f.write('info: Connected to Server db successfully ..... '+ time.strftime("%Y-%m-%d_%H-%M-%S", time.localtime())+'\n')
    return cnxn

def LoginRequest(ApplicationSender, WorkstationID, RequestID, sock):
    # Define the XML content for the first request
    xml_content_main = f"""
    <?xml version="1.0" encoding="utf-8"?>
    <ServiceRequest xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" RequestType="LogOn" ApplicationSender="{ApplicationSender}" WorkstationID="{WorkstationID}" RequestID="{RequestID}">
    <POSdata>
    <POSTimeStamp>{str(datetime.now().strftime("%Y-%m-%dT%H:%M:%S"))}</POSTimeStamp>
    <InterfaceVersion>01.00</InterfaceVersion>
    </POSdata>
    </ServiceRequest>
    """
    header_length_main = len(xml_content_main).to_bytes(4, byteorder='big')
    header_algorithm_main = int("0000").to_bytes(2, byteorder='big')
    header_main = header_length_main + header_algorithm_main
    sock.sendall(header_main+xml_content_main.encode('utf-8'))
    return sock.recv(4098)

def GetProducts(ApplicationSender, WorkstationID, RequestID, sock):
    xml_content = f"""
    <?xml version="1.0" encoding="utf-8" ?>
    <ServiceRequest xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" RequestType="GetProductTable" ApplicationSender="{ApplicationSender}" WorkstationID="{WorkstationID}" RequestID="{RequestID}">
    <POSdata>
    <POSTimeStamp>{str(datetime.now().strftime("%Y-%m-%dT%H:%M:%S"))}</POSTimeStamp>
    </POSdata>
    </ServiceRequest>
    """
    header_length = len(xml_content).to_bytes(4, byteorder='big')
    header_algorithm = int("0000").to_bytes(2, byteorder='big')
    header = header_length + header_algorithm
    sock.sendall(header+xml_content.encode('utf-8'))
    return sock.recv(4098)

def GetTanks(ApplicationSender, WorkstationID, RequestID, sock):
    xml_content = f"""
    <?xml version="1.0" encoding="utf-8"?>
    <ServiceRequest xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" RequestType="GetTankData" ApplicationSender="{ApplicationSender}" WorkstationID="{WorkstationID}" RequestID="{RequestID}">
    <POSdata>
    <POSTimeStamp>{str(datetime.now().strftime("%Y-%m-%dT%H:%M:%S"))}</POSTimeStamp>
    <DeviceClass Type="TP" DeviceID ="*">
    </POSdata>
    </ServiceRequest>
    """
    header_length = len(xml_content).to_bytes(4, byteorder='big')
    header_algorithm = int("0000").to_bytes(2, byteorder='big')
    header = header_length + header_algorithm
    sock.sendall(header+xml_content.encode('utf-8'))
    return sock.recv(4098)

def GetDSPConfiguration(ApplicationSender, WorkstationID, RequestID, sock):
    xml_content = f"""
    <?xml version="1.0" encoding="utf-8" ?>
    <ServiceRequest xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" RequestType="GetDSPConfiguration" ApplicationSender="{ApplicationSender}" WorkstationID="{WorkstationID}" RequestID="{RequestID}">
    <POSdata>
    <POSTimeStamp>{str(datetime.now().strftime("%Y-%m-%dT%H:%M:%S"))}</POSTimeStamp>
    </POSdata>
    </ServiceRequest>
    """
    header_length = len(xml_content).to_bytes(4, byteorder='big')
    header_algorithm = int("0000").to_bytes(2, byteorder='big')
    header = header_length + header_algorithm
    sock.sendall(header+xml_content.encode('utf-8'))
    return sock.recv(4098)

def GetTLGConfiguration(ApplicationSender, WorkstationID, RequestID, sock):
    xml_content = f"""
    <?xml version="1.0" encoding="utf-8" ?>
    <ServiceRequest xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" RequestType="GetTLGConfiguration" ApplicationSender="{ApplicationSender}" WorkstationID="{WorkstationID}" RequestID="{RequestID}">
    <POSdata>
    <POSTimeStamp>{str(datetime.now().strftime("%Y-%m-%dT%H:%M:%S"))}</POSTimeStamp>
    </POSdata>
    </ServiceRequest>
    """
    header_length = len(xml_content).to_bytes(4, byteorder='big')
    header_algorithm = int("0000").to_bytes(2, byteorder='big')
    header = header_length + header_algorithm
    sock.sendall(header+xml_content.encode('utf-8'))
    return sock.recv(4098)

def GetTankReconciliation(ApplicationSender, WorkstationID, RequestID, sock):
    xml_content = f"""
    <?xml version="1.0" encoding="utf-8"?>
    <ServiceRequest xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="FDC_GetTankReconciliation_Request.xsd" RequestType="GetTankReconciliation" ApplicationSender="{ApplicationSender}" WorkstationID="{WorkstationID}" RequestID="{RequestID}">
    <POSdata>
    <POSTimeStamp>{str(datetime.now().strftime("%Y-%m-%dT%H:%M:%S"))}</POSTimeStamp>
    <DeviceClass Type="TP" DeviceID ="*" />
    </POSdata>
    </ServiceRequest>
    """
    header_length = len(xml_content).to_bytes(4, byteorder='big')
    header_algorithm = int("0000").to_bytes(2, byteorder='big')
    header = header_length + header_algorithm
    sock.sendall(header+xml_content.encode('utf-8'))
    return sock.recv(4098)

def GetTankDelivery(ApplicationSender, WorkstationID, RequestID, sock):
    xml_content = f"""
    <?xml version="1.0" encoding="utf-8"?>
    <ServiceRequest xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" RequestType="GetTankDelivery" ApplicationSender="{ApplicationSender}" WorkstationID="{WorkstationID}" RequestID="{RequestID}">
    <POSdata>
    <POSTimeStamp>{str(datetime.now().strftime("%Y-%m-%dT%H:%M:%S"))}</POSTimeStamp>
    <DeviceClass Type="TP" DeviceID ="*">
    </POSdata>
    </ServiceRequest>
    """
    header_length = len(xml_content).to_bytes(4, byteorder='big')
    header_algorithm = int("0000").to_bytes(2, byteorder='big')
    header = header_length + header_algorithm
    sock.sendall(header+xml_content.encode('utf-8'))
    return sock.recv(4098)

def GetCountrySettings(ApplicationSender, WorkstationID, RequestID, sock):
    xml_content = f"""
    <?xml version="1.0" encoding="utf-8" ?>
    <ServiceRequest xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" RequestType="GetCountrySettings" ApplicationSender="{ApplicationSender}" WorkstationID="{WorkstationID}" RequestID="{RequestID}">
    <POSdata>
    <POSTimeStamp>{str(datetime.now().strftime("%Y-%m-%dT%H:%M:%S"))}</POSTimeStamp>
    </POSdata>
    </ServiceRequest>
    """
    header_length = len(xml_content).to_bytes(4, byteorder='big')
    header_algorithm = int("0000").to_bytes(2, byteorder='big')
    header = header_length + header_algorithm
    sock.sendall(header+xml_content.encode('utf-8'))
    return sock.recv(4098)




def Login():
    login_result = LoginRequest(ApplicationSender, WorkstationID, RequestID, sock)
    if not login_result:
        print('No login_result')
    with open('login.xml', 'w') as f:
        pass
    with open('login.xml', 'a') as f:
        f.write(str(login_result[6:], 'utf-8'))
    print('login finished')

def SetSite(cnxn):
    # SQL Insert Query
    site_query = '''
    INSERT INTO [dbo].[Site] ([number], [name], [lastConnection], [ip], [port])
    VALUES (?, ?, ?)
    '''
    cursor = cnxn.cursor()
    cursor.execute(site_query,
        PORT,
        HOST,
        HOST,
        PORT,
        datetime.now()
    )
    cnxn.commit()
    
def SetProduct(cnxn):
    # Insert Products Into GTSHO Database
    get_product_result = GetProducts(ApplicationSender, WorkstationID, RequestID, sock)
    if not get_product_result:
        print('No get_product_result')
    with open('get_product.xml', 'w') as f:
        pass
    with open('get_product.xml', 'a') as f:
        f.write(f'<!-- Getting Product Data As XML ===> {time.strftime("%Y-%m-%d_%H-%M-%S", time.localtime())} -->\n')
        f.write(str(get_product_result[6:], 'utf-8'))
        f.write(f'\n<!-- Inserting Product Data Into GTSHO ===> {time.strftime("%Y-%m-%d_%H-%M-%S", time.localtime())} -->\n')
    
    # Parse the XML string
    dom = xml.dom.minidom.parseString(str(get_product_result[6:], 'utf-8'))
    # Pretty print the XML
    # pretty_xml = dom.toprettyxml(indent="    ")
    # print(pretty_xml)
    
    # SQL Insert Query
    products_query = '''
    INSERT INTO [dbo].[Product] ([number], [name], [unit], [unitShort])
    VALUES (?, ?, ?, ?)
    '''
    cursor = cnxn.cursor()
    products = dom.getElementsByTagName('Product')
    for product in products:
        cursor.execute(products_query,
            product.getAttribute('ProductNo'),
            product.getAttribute('ProductName'),
            product.getAttribute('ProductUM'),
            product.getAttribute('UMShort')
        )
    cnxn.commit()
    
    with open('get_product.xml', 'a') as f:
        f.write(f'<!-- Inserting Product Data Into GTSHO Finished Successfully ===> {time.strftime("%Y-%m-%d_%H-%M-%S", time.localtime())} -->\n')
    
def SetProbe(cnxn):
    get_TLG_configuration_result = GetTLGConfiguration(ApplicationSender, WorkstationID, RequestID, sock)
    if not get_TLG_configuration_result:
        print('No get_TLG_configuration_result')
    with open('get_TLG_configuration.xml', 'w') as f:
        pass
    with open('get_TLG_configuration.xml', 'a') as f:
        f.write(f'<!-- Getting Probe Data As XML ===> {time.strftime("%Y-%m-%d_%H-%M-%S", time.localtime())} -->\n')
        f.write(str(get_TLG_configuration_result[6:], 'utf-8'))
        f.write(f'\n<!-- Inserting Probe Data Into GTSHO ===> {time.strftime("%Y-%m-%d_%H-%M-%S", time.localtime())} -->\n')
    
    # Parse the XML string
    dom = xml.dom.minidom.parseString(str(get_TLG_configuration_result[6:], 'utf-8'))
    # Pretty print the XML
    # pretty_xml = dom.toprettyxml(indent="    ")
    # print(pretty_xml)
    
    # SQL Insert Query
    probes_query = '''
    INSERT INTO [dbo].[Probe]
           ([deviceId]
           ,[tank]
           ,[product]
           ,[shellCapacity]
           ,[maxSafeFillCap]
           ,[lowCapacity]
           ,[minOperatingCapacity]
           ,[tankManifoldPartners]
           ,[HiHiLevel]
           ,[HiLevel]
           ,[LoLevel]
           ,[LoLoLevel]
           ,[HiWater]
           ,[site])
    VALUES
           (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    '''
    cursor = cnxn.cursor()
    
    site_query = f"SELECT id FROM [dbo].[Site] WHERE number = {PORT}"
    site_id = cursor.execute(site_query).fetchone()[0]
    # print(site_id)
            
    probes = dom.getElementsByTagName('DeviceClass')
    for probe in probes:
        # print(probe)
        if probe.getAttribute('Type') == 'TP':
            DeviceID = probe.getAttribute('DeviceID')
            TankNo = probe.getAttribute('TankNo')
            ProductNo = probe.getAttribute('ProductNo')
            ShellCapacity = probe.getElementsByTagName('ShellCapacity')[0].firstChild.nodeValue if probe.getElementsByTagName('ShellCapacity')[0].firstChild else 0
            MaxSafeFillCap = probe.getElementsByTagName('MaxSafeFillCap')[0].firstChild.nodeValue if probe.getElementsByTagName('MaxSafeFillCap')[0].firstChild else 0
            LowCapacity = probe.getElementsByTagName('LowCapacity')[0].firstChild.nodeValue if probe.getElementsByTagName('LowCapacity')[0].firstChild else 0
            MinOperatingCapacity = probe.getElementsByTagName('MinOperatingCapacity')[0].firstChild.nodeValue if probe.getElementsByTagName('MinOperatingCapacity')[0].firstChild else 0
            TankManifoldPartners = probe.getElementsByTagName('TankManifoldPartners')[0].firstChild.nodeValue if probe.getElementsByTagName('TankManifoldPartners')[0].firstChild else 0
            SetPoints = probe.getElementsByTagName('SetPoints')[0].firstChild.nodeValue if probe.getElementsByTagName('SetPoints')[0].firstChild else 0
            HiHiLevel = probe.getElementsByTagName('HiHiLevel')[0].firstChild.nodeValue if probe.getElementsByTagName('HiHiLevel')[0].firstChild else 0
            HiLevel = probe.getElementsByTagName('HiLevel')[0].firstChild.nodeValue if probe.getElementsByTagName('HiLevel')[0].firstChild else 0
            LoLevel = probe.getElementsByTagName('LoLevel')[0].firstChild.nodeValue if probe.getElementsByTagName('LoLevel')[0].firstChild else 0
            LoLoLevel = probe.getElementsByTagName('LoLoLevel')[0].firstChild.nodeValue if probe.getElementsByTagName('LoLoLevel')[0].firstChild else 0
            HiWater = probe.getElementsByTagName('HiWater')[0].firstChild.nodeValue if probe.getElementsByTagName('HiWater')[0].firstChild else 0

            # print(DeviceID)
            # print(TankNo)
            # print(ProductNo)
            # print(ShellCapacity)
            # print(MaxSafeFillCap)
            # print(LowCapacity)
            # print(MinOperatingCapacity)
            # print(TankManifoldPartners)
            # print(SetPoints)
            # print(HiHiLevel)
            # print(HiLevel)
            # print(LoLevel)
            # print(LoLoLevel)
            # print(HiWater)
            
            product_query = f"SELECT id FROM [dbo].[Product] WHERE number = {int(ProductNo)}"
            product_id = cursor.execute(product_query).fetchone()[0]
            # print(product_id.fetchone()[0])
            
            cursor.execute(probes_query,
                DeviceID,
                TankNo,
                product_id,
                ShellCapacity,
                MaxSafeFillCap,
                LowCapacity,
                MinOperatingCapacity,
                TankManifoldPartners,
                HiHiLevel,
                HiLevel,
                LoLevel,
                LoLoLevel,
                HiWater,
                site_id
            )
    cnxn.commit()
    
    with open('get_TLG_configuration.xml', 'a') as f:
        f.write(f'<!-- Inserting Probe Data Into GTSHO Finished Successfully ===> {time.strftime("%Y-%m-%d_%H-%M-%S", time.localtime())} -->\n')
    
def SetTank(cnxn):
    get_tank_result = GetTanks(ApplicationSender, WorkstationID, RequestID, sock)
    if not get_tank_result:
        print('No get_tank_result')
    with open('get_tank.xml', 'w') as f:
        pass
    with open('get_tank.xml', 'a') as f:
        f.write(f'<!-- Getting Tank Data As XML ===> {time.strftime("%Y-%m-%d_%H-%M-%S", time.localtime())} -->\n')
        f.write(str(get_tank_result[6:], 'utf-8'))
        f.write(f'\n<!-- Inserting Tank Data Into GTSHO ===> {time.strftime("%Y-%m-%d_%H-%M-%S", time.localtime())} -->\n')
        
    # Parse the XML string
    dom = xml.dom.minidom.parseString(str(get_tank_result[6:], 'utf-8'))
    # Pretty print the XML
    # pretty_xml = dom.toprettyxml(indent="    ")
    # print(pretty_xml)
    
    # SQL Insert Query
    tanks_query = '''
    INSERT INTO [dbo].[Tank]
           ([probe]
           ,[product]
           ,[ProductLevel]
           ,[TotalObservedVolume]
           ,[GrossStandardVolume]
           ,[AverageTemp]
           ,[WaterLevel]
           ,[ObservedDensity]
           ,[Density]
           ,[WaterVolume]
           ,[Ullage]
           ,[DeliveryInProgress]
           ,[ProductWeight]
           ,[LastReadDateTime]
           ,[site])
    VALUES
           (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    '''
    tanks_update_query = '''
    UPDATE [dbo].[Tank]
        SET [probe] = ?
            ,[product] = ?
            ,[ProductLevel] = ?
            ,[TotalObservedVolume] = ?
            ,[GrossStandardVolume] = ?
            ,[AverageTemp] = ?
            ,[WaterLevel] = ?
            ,[ObservedDensity] = ?
            ,[Density] = ?
            ,[WaterVolume] = ?
            ,[Ullage] = ?
            ,[DeliveryInProgress] = ?
            ,[ProductWeight] = ?
            ,[LastReadDateTime] = ?
            ,[site] = ?
        WHERE [id] = ?
    '''
    # SQL Insert Query
    tanks_histroy_query = '''
    INSERT INTO [dbo].[TankHistory]
           ([probe]
           ,[product]
           ,[ProductLevel]
           ,[TotalObservedVolume]
           ,[GrossStandardVolume]
           ,[AverageTemp]
           ,[WaterLevel]
           ,[ObservedDensity]
           ,[Density]
           ,[WaterVolume]
           ,[Ullage]
           ,[DeliveryInProgress]
           ,[ProductWeight]
           ,[LastReadDateTime]
           ,[site])
    VALUES
           (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    '''
    cursor = cnxn.cursor()
    
    site_query = f"SELECT id FROM [dbo].[Site] WHERE number = {PORT}"
    site_id = cursor.execute(site_query).fetchone()[0]
    # print(site_id)
            
    tanks = dom.getElementsByTagName('DeviceClass')
    for tank in tanks:
        # print(probe)
        if tank.getAttribute('Type') == 'TP':
            TankNo = tank.getAttribute('TankNo')
            ProductLevel = tank.getElementsByTagName('ProductLevel')[0].firstChild.nodeValue
            TotalObservedVolume = tank.getElementsByTagName('TotalObservedVolume')[0].firstChild.nodeValue
            GrossStandardVolume = tank.getElementsByTagName('GrossStandardVolume')[0].firstChild.nodeValue
            AverageTemp = tank.getElementsByTagName('AverageTemp')[0].firstChild.nodeValue
            WaterLevel = tank.getElementsByTagName('WaterLevel')[0].firstChild.nodeValue
            ObservedDensity = tank.getElementsByTagName('ObservedDensity')[0].firstChild.nodeValue
            Density = tank.getElementsByTagName('Density')[0].firstChild.nodeValue
            WaterVolume = tank.getElementsByTagName('WaterVolume')[0].firstChild.nodeValue
            Ullage = tank.getElementsByTagName('Ullage')[0].firstChild.nodeValue
            DeliveryInProgress = tank.getElementsByTagName('DeliveryInProgress')[0].firstChild.nodeValue
            ProductWeight = tank.getElementsByTagName('ProductWeight')[0].firstChild.nodeValue
            LastReadDateTime = tank.getElementsByTagName('LastReadDateTime')[0].firstChild.nodeValue

            # print(TankNo)
            # print(ProductLevel)
            # print(TotalObservedVolume)
            # print(GrossStandardVolume)
            # print(AverageTemp)
            # print(WaterLevel)
            # print(ObservedDensity)
            # print(Density)
            # print(WaterVolume)
            # print(Ullage)
            # print(DeliveryInProgress)
            # print(ProductWeight)
            # print(LastReadDateTime)
            
            probe_product_query = f"SELECT id, product FROM [dbo].[Probe] WHERE tank = {int(TankNo)}"
            probe_id = cursor.execute(probe_product_query).fetchone()[0]
            product_id = cursor.execute(probe_product_query).fetchone()[1]
            # print(probe_id, product_id)
            
            tank_check_query = f"SELECT id FROM [dbo].[Tank] WHERE probe = {int(probe_id)}"
            tank_id = cursor.execute(tank_check_query).fetchone()[0]
            # print(tank_id)
            
            if tank_id:
                cursor.execute(tanks_update_query,
                    probe_id,
                    product_id,
                    ProductLevel,
                    TotalObservedVolume,
                    GrossStandardVolume,
                    AverageTemp,
                    WaterLevel,
                    ObservedDensity,
                    Density,
                    WaterVolume,
                    Ullage,
                    DeliveryInProgress,
                    ProductWeight,
                    LastReadDateTime,
                    site_id,
                    tank_id
                )
            else:
                cursor.execute(tanks_query,
                    probe_id,
                    product_id,
                    ProductLevel,
                    TotalObservedVolume,
                    GrossStandardVolume,
                    AverageTemp,
                    WaterLevel,
                    ObservedDensity,
                    Density,
                    WaterVolume,
                    Ullage,
                    DeliveryInProgress,
                    ProductWeight,
                    LastReadDateTime,
                    site_id,
                )
            cursor.execute(tanks_histroy_query,
                probe_id,
                product_id,
                ProductLevel,
                TotalObservedVolume,
                GrossStandardVolume,
                AverageTemp,
                WaterLevel,
                ObservedDensity,
                Density,
                WaterVolume,
                Ullage,
                DeliveryInProgress,
                ProductWeight,
                LastReadDateTime,
                site_id,
            )
    cnxn.commit()
    
    with open('get_TLG_configuration.xml', 'a') as f:
        f.write(f'<!-- Inserting Tank Data Into GTSHO Finished Successfully ===> {time.strftime("%Y-%m-%d_%H-%M-%S", time.localtime())} -->\n')

# def SetPump(cnxn):
#     get_DSP_configuration_result = GetDSPConfiguration(ApplicationSender, WorkstationID, RequestID, sock)
#     if not get_DSP_configuration_result:
#         print('No get_DSP_configuration_result')
#     with open('get_DSP_configuration.xml', 'w') as f:
#         pass
#     with open('get_DSP_configuration.xml', 'a') as f:
#         f.write(f'<!-- Getting Pump Data As XML ===> {time.strftime("%Y-%m-%d_%H-%M-%S", time.localtime())} -->\n')
#         f.write(str(get_DSP_configuration_result[6:], 'utf-8'))
#         f.write(f'\n<!-- Inserting Pump Data Into GTSHO ===> {time.strftime("%Y-%m-%d_%H-%M-%S", time.localtime())} -->\n')

#     # Parse the XML string
#     dom = xml.dom.minidom.parseString(str(get_DSP_configuration_result[6:], 'utf-8'))
#     # Pretty print the XML
#     # pretty_xml = dom.toprettyxml(indent="    ")
#     # print(pretty_xml)
    
#     # SQL Insert Query
#     pumps_query = '''
#     INSERT INTO [dbo].[Probe]
#            ([deviceId]
#            ,[tank]
#            ,[product]
#            ,[shellCapacity]
#            ,[maxSafeFillCap]
#            ,[lowCapacity]
#            ,[minOperatingCapacity]
#            ,[tankManifoldPartners]
#            ,[HiHiLevel]
#            ,[HiLevel]
#            ,[LoLevel]
#            ,[LoLoLevel]
#            ,[HiWater]
#            ,[site])
#     VALUES
#            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
#     '''
#     cursor = cnxn.cursor()
    
#     site_query = f"SELECT id FROM [dbo].[Site] WHERE number = {PORT}"
#     site_id = cursor.execute(site_query).fetchone()[0]
#     # print(site_id)
            
#     probes = dom.getElementsByTagName('DeviceClass')
#     for probe in probes:
#         # print(probe)
#         if probe.getAttribute('Type') == 'TP':
#             DeviceID = probe.getAttribute('DeviceID')
#             TankNo = probe.getAttribute('TankNo')
#             ProductNo = probe.getAttribute('ProductNo')
#             ShellCapacity = probe.getElementsByTagName('ShellCapacity')[0].firstChild.nodeValue if probe.getElementsByTagName('ShellCapacity')[0].firstChild else 0
#             MaxSafeFillCap = probe.getElementsByTagName('MaxSafeFillCap')[0].firstChild.nodeValue if probe.getElementsByTagName('MaxSafeFillCap')[0].firstChild else 0
#             LowCapacity = probe.getElementsByTagName('LowCapacity')[0].firstChild.nodeValue if probe.getElementsByTagName('LowCapacity')[0].firstChild else 0
#             MinOperatingCapacity = probe.getElementsByTagName('MinOperatingCapacity')[0].firstChild.nodeValue if probe.getElementsByTagName('MinOperatingCapacity')[0].firstChild else 0
#             TankManifoldPartners = probe.getElementsByTagName('TankManifoldPartners')[0].firstChild.nodeValue if probe.getElementsByTagName('TankManifoldPartners')[0].firstChild else 0
#             SetPoints = probe.getElementsByTagName('SetPoints')[0].firstChild.nodeValue if probe.getElementsByTagName('SetPoints')[0].firstChild else 0
#             HiHiLevel = probe.getElementsByTagName('HiHiLevel')[0].firstChild.nodeValue if probe.getElementsByTagName('HiHiLevel')[0].firstChild else 0
#             HiLevel = probe.getElementsByTagName('HiLevel')[0].firstChild.nodeValue if probe.getElementsByTagName('HiLevel')[0].firstChild else 0
#             LoLevel = probe.getElementsByTagName('LoLevel')[0].firstChild.nodeValue if probe.getElementsByTagName('LoLevel')[0].firstChild else 0
#             LoLoLevel = probe.getElementsByTagName('LoLoLevel')[0].firstChild.nodeValue if probe.getElementsByTagName('LoLoLevel')[0].firstChild else 0
#             HiWater = probe.getElementsByTagName('HiWater')[0].firstChild.nodeValue if probe.getElementsByTagName('HiWater')[0].firstChild else 0

#             # print(DeviceID)
#             # print(TankNo)
#             # print(ProductNo)
#             # print(ShellCapacity)
#             # print(MaxSafeFillCap)
#             # print(LowCapacity)
#             # print(MinOperatingCapacity)
#             # print(TankManifoldPartners)
#             # print(SetPoints)
#             # print(HiHiLevel)
#             # print(HiLevel)
#             # print(LoLevel)
#             # print(LoLoLevel)
#             # print(HiWater)
            
#             product_query = f"SELECT id FROM [dbo].[Product] WHERE number = {int(ProductNo)}"
#             product_id = cursor.execute(product_query).fetchone()[0]
#             # print(product_id.fetchone()[0])
            
#             cursor.execute(probes_query,
#                 DeviceID,
#                 TankNo,
#                 product_id,
#                 ShellCapacity,
#                 MaxSafeFillCap,
#                 LowCapacity,
#                 MinOperatingCapacity,
#                 TankManifoldPartners,
#                 HiHiLevel,
#                 HiLevel,
#                 LoLevel,
#                 LoLoLevel,
#                 HiWater,
#                 site_id
#             )
#     cnxn.commit()
    
#     with open('get_TLG_configuration.xml', 'a') as f:
#         f.write(f'<!-- Inserting Probe Data Into GTSHO Finished Successfully ===> {time.strftime("%Y-%m-%d_%H-%M-%S", time.localtime())} -->\n')



try:
    # connection
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.connect((HOST, PORT))
        # sock.settimeout(20)
        
        Login()
        time.sleep(2)

        # open database connection
        cnxn = connectionsConfig()
        
        # Insert Site Into GTSHO Database
        # SetSite(cnxn)
        # time.sleep(2)
        
        # Insert Products Into GTSHO Database
        # SetProduct(cnxn)
        # time.sleep(2)
        
        # Insert Probe Into GTSHO Database
        # SetProbe(cnxn)
        # time.sleep(2)
        
        # Insert Tank Into GTSHO Database
        SetTank(cnxn)
        time.sleep(2)
        
        # Insert Probe Into GTSHO Database
        # SetPump(cnxn)
        # time.sleep(2)

        # get_TLG_configuration_result = GetTLGConfiguration(ApplicationSender, WorkstationID, RequestID, sock)
        # if not get_TLG_configuration_result:
        #     print('No get_TLG_configuration_result')
        # with open('get_TLG_configuration.xml', 'w') as f:
        #     pass
        # with open('get_TLG_configuration.xml', 'a') as f:
        #     f.write(str(get_TLG_configuration_result[6:], 'utf-8'))
        # print('TLG Configuration finished')
        # time.sleep(2)
        
        # get_tank_result = GetTanks(ApplicationSender, WorkstationID, RequestID, sock)
        # if not get_tank_result:
        #     print('No get_tank_result')
        # with open('get_tank.xml', 'w') as f:
        #     pass
        # with open('get_tank.xml', 'a') as f:
        #     f.write(f'<!-- Getting Tank Data As XML ===> {time.strftime("%Y-%m-%d_%H-%M-%S", time.localtime())} -->\n')
        #     f.write(str(get_tank_result[6:], 'utf-8'))
        #     f.write(f'\n<!-- Inserting Tank Data Into GTSHO ===> {time.strftime("%Y-%m-%d_%H-%M-%S", time.localtime())} -->\n')
        # print('tank finished')
        # time.sleep(2)

        # get_DSP_configuration_result = GetDSPConfiguration(ApplicationSender, WorkstationID, RequestID, sock)
        # if not get_DSP_configuration_result:
        #     print('No get_DSP_configuration_result')
        # with open('get_DSP_configuration.xml', 'w') as f:
        #     pass
        # with open('get_DSP_configuration.xml', 'a') as f:
        #     f.write(str(get_DSP_configuration_result[6:], 'utf-8'))
        # print('DSP Configuration finished')
        # time.sleep(2)

        # get_tank_reconciliation_result = GetTankReconciliation(ApplicationSender, WorkstationID, RequestID, sock)
        # if not get_tank_reconciliation_result:
        #     print('No get_tank_reconciliation_result')
        # with open('get_tank_reconciliation.xml', 'w') as f:
        #     pass
        # with open('get_tank_reconciliation.xml', 'a') as f:
        #     f.write(str(get_tank_reconciliation_result[6:], 'utf-8'))
        # print('tank reconciliation finished')
        # time.sleep(2)
        

        # get_tank_delivery_result = GetTankDelivery(ApplicationSender, WorkstationID, RequestID, sock)
        # if not get_tank_delivery_result:
        #     print('No get_tank_delivery_result')
        # with open('get_tank_delivery.xml', 'w') as f:
        #     pass
        # with open('get_tank_delivery.xml', 'a') as f:
        #     f.write(str(get_tank_delivery_result[6:], 'utf-8'))
        # print('tank delivery finished')
        # time.sleep(2)
        

        # get_country_settings_result = GetCountrySettings(ApplicationSender, WorkstationID, RequestID, sock)
        # if not get_country_settings_result:
        #     print('No get_country_settings_result')
        # with open('get_country_settings.xml', 'w') as f:
        #     pass
        # with open('get_country_settings.xml', 'a') as f:
        #     f.write(str(get_country_settings_result[6:], 'utf-8'))
        # print('Country Settings finished')
        # time.sleep(2)
        
        # sock.settimeout(10)
        # response = b''
        # while True:
        #     chunk = sock.recv(4098)
        #     if not chunk:
        #         break
        #     response = chunk
        #     with open('Service.log', 'a') as f:
        #         f.write(str(response[6:], 'utf-8'))

        #     print("chunk 5-14-2024")
            # print(str(chunk[6:], 'utf-8'))

            # convert xml to json
            # xpars = xmltodict.parse(str(chunk[6:], 'utf-8'))
            # print ("xpars")
            # print (xpars)
            # json_data = json.dumps(xpars, indent = 2)
            # json_data = json.loads(json_data)
            # print ("json_data")
            # print (json_data)
            
            # if config_flag:
            #     config_flag = 0
            # if count == 2:
            #     gpr = GetProducts(ApplicationSender, WorkstationID, RequestID)
            #     sock.sendall(gpr)
            #     count +=1

            # # conditions
            # try:
            #     # reading Config after twice Heartbeat
            #     if count == 2:
            #         RequestID += 1
            #         print("Get Configgggggggggggggggggggggggggggggggggggggggggggggggg")
            #         config_flag = 1
            #         xml_content = f"""
            #         <?xml version="1.0" encoding="utf-8"?>
            #         <ServiceRequest xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" RequestType="GetProductTable" ApplicationSender="{ApplicationSender}" WorkstationID="{WorkstationID}" RequestID="{RequestID}">
            #         <POSdata>
            #         <POSTimeStamp>{str(datetime.now().strftime("%Y-%m-%dT%H:%M:%S"))}</POSTimeStamp>
            #         </POSdata>
            #         </ServiceRequest>
            #         """

                    
                    
            #         header_length = len(xml_content).to_bytes(4, byteorder='big')
            #         header_algorithm = int("0000").to_bytes(2, byteorder='big')
            #         header = header_length + header_algorithm

            #         count +=1
            #         sock.sendall(header+xml_content.encode('utf-8'))

            #     if count == 4:
            #         RequestID += 1

            #         print("Get Configgggggggggggggggggggggggggggggggggggggggggggggggg")
            #         config_flag = 1
            #         xml_content = f"""
            #         <?xml version="1.0" encoding="utf-8"?>
            #         <ServiceRequest xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" RequestType="GetDSPConfiguration" ApplicationSender="{ApplicationSender}" WorkstationID="{WorkstationID}" RequestID="{RequestID}">
            #         <POSdata>
            #         <POSTimeStamp>{str(datetime.now().strftime("%Y-%m-%dT%H:%M:%S"))}</POSTimeStamp>
            #         </POSdata>
            #         </ServiceRequest>
            #         """

                    
                    
            #         header_length = len(xml_content).to_bytes(4, byteorder='big')
            #         header_algorithm = int("0000").to_bytes(2, byteorder='big')
            #         header = header_length + header_algorithm

            #         count +=1
            #         sock.sendall(header+xml_content.encode('utf-8'))
                
            #     if count == 6:
            #         RequestID += 1
            #         print("Get Configgggggggggggggggggggggggggggggggggggggggggggggggg")
            #         config_flag = 1
            #         xml_content = f"""
            #         <?xml version="1.0" encoding="utf-8"?>
            #         <ServiceRequest xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" RequestType="GetTLGConfiguration" ApplicationSender="{ApplicationSender}" WorkstationID="{WorkstationID}" RequestID="{RequestID}">
            #         <POSdata>
            #         <POSTimeStamp>{str(datetime.now().strftime("%Y-%m-%dT%H:%M:%S"))}</POSTimeStamp>
            #         </POSdata>
            #         </ServiceRequest>
            #         """

                    
                    
            #         header_length = len(xml_content).to_bytes(4, byteorder='big')
            #         header_algorithm = int("0000").to_bytes(2, byteorder='big')
            #         header = header_length + header_algorithm

            #         count +=1
            #         sock.sendall(header+xml_content.encode('utf-8'))
                
            #     if count == 8:
            #         RequestID += 1

            #         print("Get Configgggggggggggggggggggggggggggggggggggggggggggggggg")
            #         config_flag = 1
            #         xml_content = f"""
            #         <?xml version="1.0" encoding="utf-8"?>
            #         <ServiceRequest xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" RequestType="GetTankData" ApplicationSender="{ApplicationSender}" WorkstationID="{WorkstationID}" RequestID="{RequestID}">
            #         <POSdata>
            #         <POSTimeStamp>{str(datetime.now().strftime("%Y-%m-%dT%H:%M:%S"))}</POSTimeStamp>
            #         <DeviceClass Type="TP" DeviceID ="*">
            #         </POSdata>
            #         </ServiceRequest>
            #         """
                    
            #         header_length = len(xml_content).to_bytes(4, byteorder='big')
            #         header_algorithm = int("0000").to_bytes(2, byteorder='big')
            #         header = header_length + header_algorithm

            #         count +=1
            #         sock.sendall(header+xml_content.encode('utf-8'))
                
                
            #     if count == 1:
            #         RequestID += 1

            #         print("Get Configgggggggggggggggggggggggggggggggggggggggggggggggg")
            #         config_flag = 1
            #         xml_content = f"""
            #         <?xml version="1.0" encoding="utf-8"?>
            #         <ServiceRequest xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  RequestType="GetEndOfDayInfo" ApplicationSender="{ApplicationSender}" WorkstationID="{WorkstationID}" RequestID="{RequestID}">
            #         <POSdata>
            #         <POSTimeStamp>{str(datetime.now().strftime("%Y-%m-%dT%H:%M:%S"))}</POSTimeStamp>
            #         </POSdata>
            #         </ServiceRequest>
            #         """
                    
            #         header_length = len(xml_content).to_bytes(4, byteorder='big')
            #         header_algorithm = int("0000").to_bytes(2, byteorder='big')
            #         header = header_length + header_algorithm

            #         count +=1
            #         sock.sendall(header+xml_content.encode('utf-8'))

            # except Exception as e:
            #     print("Error at conditions: ", e)
            #     pass
            


            # # reading json as service response
            # try:
            #     # conditions is service response
            #     if json_data['ServiceResponse'] and config_flag == 0 :
            #         print ("ServiceResponse successsssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss")
            #         # print(json_data['ServiceResponse'])
            #         data = json_data['ServiceResponse']
                    
            #         if json_data['ServiceResponse']['@RequestType'] == "LogOn" and json_data['ServiceResponse']['@OverallResult'] == "Success" :
            #             print("logOn")
            #             # xml_content = f"""
            #             # <?xml version="1.0" encoding="utf-8"?>
            #             # <POSMessage xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" MessageType="POS_Ready" ApplicationSender="{ApplicationSender}" WorkstationID="{WorkstationID}" MessageID="1">
            #             # <POSdata>
            #             # <POSTimeStamp>{str(datetime.now().strftime("%Y-%m-%dT%H:%M:%S"))}</POSTimeStamp>
            #             # </POSdata>
            #             # </POSMessage>
            #             # """
                        
            #             # header_length = len(xml_content).to_bytes(4, byteorder='big')
            #             # header_algorithm = int("0000").to_bytes(2, byteorder='big')
            #             # header = header_length + header_algorithm

            #             # # sock.settimeout(20)
            #             # sock.sendall(header+xml_content.encode('utf-8'))

                        
            #         elif json_data['ServiceResponse']['@RequestType'] == "GetProductTable" and json_data['ServiceResponse']['@OverallResult'] == "Success":
            #             print("GetProductTable")
            #             FDC_data = json_data['ServiceResponse']['FDCdata']
            #             FuelProducts = FDC_data['FuelProducts']
            #             with open('GetProductTable.log', 'w') as f:
            #                     f.write(''+str(FuelProducts)+'\n')
                        
            #         elif json_data['ServiceResponse']['@RequestType'] == "GetDSPConfiguration" and json_data['ServiceResponse']['@OverallResult'] == "Success":
            #             print("GetDSPConfiguration")
            #             FDC_data = json_data['ServiceResponse']['FDCdata']
            #             DeviceClass = FDC_data['DeviceClass']
            #             with open('GetDSPConfiguration.log', 'w') as f:
            #                     f.write(''+str(DeviceClass)+'\n')
                        
            #             for Device in DeviceClass:
            #                 # print(str(d))
            #                 with open('GetDSPConfiguration.log', 'a') as f:
            #                     f.write(''+str(Device)+'\n')

            #                 RequestID += 1


            #                 Type=Device['DeviceClass']['@Type']
            #                 DeviceID=Device['DeviceClass']['@DeviceID']
                            
            #                 print("Get Configgggggggggggggggggggggggggggggggggggggggggggggggg")
            #                 print(Type)
            #                 print(DeviceID)

            #                 config_flag = 1
            #                 xml_content = f"""
            #                 <?xml version="1.0" encoding="utf-8"?>
            #                 <ServiceRequest xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" RequestType="GetFuelSaleTrxDetails" ApplicationSender="{ApplicationSender}" WorkstationID="{WorkstationID}" RequestID="{RequestID}">
            #                 <POSdata>
            #                 <POSTimeStamp>{str(datetime.now().strftime("%Y-%m-%dT%H:%M:%S"))}</POSTimeStamp>
            #                 <DeviceClass Type="{Type}" DeviceID ="{DeviceID}" TransactionSeqNo="*">
            #                 </POSdata>
            #                 </ServiceRequest>
            #                 """

                            
                            
            #                 header_length = len(xml_content).to_bytes(4, byteorder='big')
            #                 header_algorithm = int("0000").to_bytes(2, byteorder='big')
            #                 header = header_length + header_algorithm

            #                 count +=1
            #                 sock.sendall(header+xml_content.encode('utf-8'))

            #                 # time.sleep(1)
                    
            #         elif json_data['ServiceResponse']['@RequestType'] == "GetTLGConfiguration" and json_data['ServiceResponse']['@OverallResult'] == "Success":
            #             print("GetTLGConfiguration")
            #             FDC_data = json_data['ServiceResponse']['FDCdata']
            #             DeviceClass = FDC_data['DeviceClass']
            #             with open('GetTLGConfiguration.log', 'w') as f:
            #                     f.write(''+str(DeviceClass)+'\n')

            #             for Device in DeviceClass['DeviceClass']:
            #                 RequestID += 1

            #                 # print(str(d))
            #                 with open('GetTLGConfiguration.log', 'a') as f:
            #                     f.write(''+str(Device)+'\n')

            #                 Type=Device['@Type']
            #                 DeviceID=Device['@DeviceID']
                            
            #                 print("Get Configgggggggggggggggggggggggggggggggggggggggggggggggg")
            #                 print(Type)
            #                 print(DeviceID)

            #                 config_flag = 1
            #                 xml_content = f"""
            #                 <?xml version="1.0" encoding="utf-8"?>
            #                 <ServiceRequest xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="FDC_GetTankReconciliation_Request.xsd" RequestType="GetTankReconciliation" ApplicationSender="{ApplicationSender}" WorkstationID="{WorkstationID}" RequestID="{RequestID}">
            #                 <POSdata>
            #                 <POSTimeStamp>{str(datetime.now().strftime("%Y-%m-%dT%H:%M:%S"))}</POSTimeStamp>
            #                 <DeviceClass Type="{Type}" DeviceID ="{DeviceID}">
            #                 </POSdata>
            #                 </ServiceRequest>
            #                 """

                            
                            
            #                 header_length = len(xml_content).to_bytes(4, byteorder='big')
            #                 header_algorithm = int("0000").to_bytes(2, byteorder='big')
            #                 header = header_length + header_algorithm

            #                 count +=1
            #                 sock.sendall(header+xml_content.encode('utf-8'))

            #                 # time.sleep(1)
                    
            #         elif json_data['ServiceResponse']['@RequestType'] == "GetTankData" and json_data['ServiceResponse']['@OverallResult'] == "Success":
            #             print("GetTankData")
            #             FDC_data = json_data['ServiceResponse']['FDCdata']
            #             DeviceClass = FDC_data['DeviceClass']
            #             with open('GetTankData.log', 'a') as f:
            #                     f.write(''+str(DeviceClass)+'\n')
                        

            #             for Device in DeviceClass:
            #                 RequestID += 1

            #                 # print(str(d))
            #                 with open('GetTankData.log', 'a') as f:
            #                     f.write(''+str(Device)+'\n')

            #                 Type=Device['@Type']
            #                 DeviceID=Device['@DeviceID']
                            
            #                 print("Get Configgggggggggggggggggggggggggggggggggggggggggggggggg")
            #                 print(Type)
            #                 print(DeviceID)

            #                 # Get Tank Reconciliation Info

            #                 config_flag = 1
            #                 xml_content = f"""
            #                 <?xml version="1.0" encoding="utf-8"?>
            #                 <ServiceRequest xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" RequestType="GetTankReconciliation" ApplicationSender="{ApplicationSender}" WorkstationID="{WorkstationID}" RequestID="{RequestID}">
            #                 <POSdata>
            #                 <POSTimeStamp>{str(datetime.now().strftime("%Y-%m-%dT%H:%M:%S"))}</POSTimeStamp>
            #                 <DeviceClass Type="{Type}" DeviceID ="{DeviceID}">
            #                 </POSdata>
            #                 </ServiceRequest>
            #                 """

                            
                            
            #                 header_length = len(xml_content).to_bytes(4, byteorder='big')
            #                 header_algorithm = int("0000").to_bytes(2, byteorder='big')
            #                 header = header_length + header_algorithm

            #                 count +=1
            #                 sock.sendall(header+xml_content.encode('utf-8'))
                            
                            
            #                 # Get Tank Delivery Info

            #                 config_flag = 1
            #                 xml_content = f"""
            #                 <?xml version="1.0" encoding="utf-8"?>
            #                 <ServiceRequest xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" RequestType="GetTankDelivery" ApplicationSender="{ApplicationSender}" WorkstationID="{WorkstationID}" RequestID="{RequestID}">
            #                 <POSdata>
            #                 <POSTimeStamp>{str(datetime.now().strftime("%Y-%m-%dT%H:%M:%S"))}</POSTimeStamp>
            #                 <DeviceClass Type="{Type}" DeviceID ="{DeviceID}">
            #                 </POSdata>
            #                 </ServiceRequest>
            #                 """

                            
                            
            #                 header_length = len(xml_content).to_bytes(4, byteorder='big')
            #                 header_algorithm = int("0000").to_bytes(2, byteorder='big')
            #                 header = header_length + header_algorithm

            #                 count +=1
            #                 sock.sendall(header+xml_content.encode('utf-8'))

            #                 # time.sleep(1)
                    
                    
            #         elif json_data['ServiceResponse']['@RequestType'] == "GetTankReconciliation" and json_data['ServiceResponse']['@OverallResult'] == "Success":
            #             print("GetTankReconciliation")
            #             FDC_data = json_data['ServiceResponse']['FDCdata']
            #             with open('GetTankReconciliation.log', 'a') as f:
            #                     f.write(''+str(FDC_data)+'\n')
                    
                    
            #         elif json_data['ServiceResponse']['@RequestType'] == "GetTankDelivery" and json_data['ServiceResponse']['@OverallResult'] == "Success":
            #             print("GetTankDelivery")
            #             FDC_data = json_data['ServiceResponse']['FDCdata']
            #             with open('GetTankDelivery.log', 'a') as f:
            #                     f.write(''+str(FDC_data)+'\n')
                    

            #         elif json_data['ServiceResponse']['@RequestType'] == "GetEndOfDayInfo" and json_data['ServiceResponse']['@OverallResult'] == "Success":
            #             print("GetEndOfDayInfo")
            #             FDC_data = json_data['ServiceResponse']['FDCdata']
            #             # DeviceClass = FDC_data['DeviceClass']
            #             with open('GetEndOfDayInfo.log', 'a') as f:
            #                     f.write(''+str(FDC_data)+'\n')
                    
                    
            #         elif json_data['ServiceResponse']['@RequestType'] == "GetFuelSaleTrxDetails" and json_data['ServiceResponse']['@OverallResult'] == "Success":
            #             print("GetFuelSaleTrxDetails")
            #             FDC_data = json_data['ServiceResponse']['FDCdata']
            #             DeviceClass = FDC_data['DeviceClass']
            #             with open('GetFuelSaleTrxDetails.log', 'a') as f:
            #                     f.write(''+str(FDC_data)+'\n')
                    

            #         elif json_data['ServiceResponse']['@OverallResult'] != "Success":
            #             print('OverallResulttttttttttttttttttttttttttttttttttttt error')
            #             print(str(json_data['ServiceResponse']['@OverallResult']))
                    

            #         else:
            #             print("Exception")
            #             raise(Exception)

            #     else:
            #         pass
            # except Exception as e:
            #     print("Error at ServiceResponse:", e)
            #     pass
            


            # # reading json as FDC Message
            # try:
            #     # condition FDC Message is Heartbeat
            #     if json_data['FDCMessage'] and config_flag == 0 :
            #         print ("FDCMessage successsssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss")
            #         # print(json_data['FDCMessage'])
            #         if json_data['FDCMessage']['@MessageType'] == "FDC_Ready" :
            #             MessageID = json_data['FDCMessage']['@MessageID']
            #             print("FDC_Ready")
            #             print(MessageID)

            #             xml_content = f"""
            #             <?xml version="1.0" encoding="utf-8"?>
            #             <POSMessage xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" MessageType="POS_Ready" ApplicationSender="{ApplicationSender}" WorkstationID="{WorkstationID}" MessageID="{str(int(MessageID)+1)}">
            #             <POSdata>
            #             <POSTimeStamp>{str(datetime.now().strftime("%Y-%m-%dT%H:%M:%S"))}</POSTimeStamp>
            #             </POSdata>
            #             </POSMessage>
            #             """
                        
            #             header_length = len(xml_content).to_bytes(4, byteorder='big')
            #             header_algorithm = int("0000").to_bytes(2, byteorder='big')
            #             header = header_length + header_algorithm

            #             count +=1
            #             sock.sendall(header+xml_content.encode('utf-8'))


            #         # reading json conditions as FDC Fuelling message
            #         elif json_data['FDCMessage']['@MessageType'] == "FPStateChange" :
            #             FDCdata = json_data['FDCMessage']['FDCdata']
            #             print("FDCdata")
            #             print(FDCdata)

            #             DeviceClass = FDCdata['DeviceClass']
            #             Type=DeviceClass['@Type']
            #             DeviceID=DeviceClass['@DeviceID']
            #             PumpNo=DeviceClass['@PumpNo']
            #             NozzleNo=DeviceClass['Nozzle']['@NozzleNo']

            #             FDCTimeStamp = FDCdata['FDCTimeStamp']
            #             DeviceState = json_data['FDCMessage']['FDCdata']['DeviceClass']['DeviceState']

            #             if DeviceState == "FDC_AUTHORISED" :
            #                 # with open( ''+str(Type)+str(DeviceID)+str(PumpNo)+str(NozzleNo)+'.log' , 'a') as f:
            #                 with open(f'{Type}_{DeviceID}_{PumpNo}_{NozzleNo}.log', 'a') as f:
            #                             f.write(str(DeviceState)+'_'+str(FDCTimeStamp)+'\n')
            #                 print("FDC_AUTHORISED Done")

            #             # with open(f'{Type}_{DeviceID}_{PumpNo}_{NozzleNo}.log', 'a') as f:
            #             #             f.write(str(DeviceState)+'_'+str(FDCTimeStamp)+'\n')
            #             # print("FDC_AUTHORISED Done")

            #             print("FDC_AUTHORISED")


            #         # reading json conditions as FDC Fuelling message
            #         elif json_data['FDCMessage']['@MessageType'] == "FuelPointCurrentFuellingStatus" :
            #             FDCdata = json_data['FDCMessage']['FDCdata']
            #             print("FDCdata")
            #             print(FDCdata)
            #             DeviceClass = FDCdata['DeviceClass']
            #             print("DeviceClass")
            #             print(DeviceClass)
            #             Type=DeviceClass['@Type']
            #             DeviceID=DeviceClass['@DeviceID']
            #             PumpNo=DeviceClass['@PumpNo']
            #             NozzleNo=DeviceClass['@NozzleNo']
            #             # with open( ''+str(Type)+str(DeviceID)+str(PumpNo)+str(NozzleNo)+'.log' , 'a') as f:
            #             with open(f'{Type}_{DeviceID}_{PumpNo}_{NozzleNo}.log', 'a') as f:
            #                         f.write(str(FDCdata)+'\n')
            #             print("Done")

            #     else:
            #         pass
            # except Exception as e:
            #     print("Error at FDCMessage:", e)
            #     pass


            

            # xml_content = f"""
            # <?xml version="1.0" encoding="utf-8"?>
            # <POSMessage xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" RequestType="POS_Ready" ApplicationSender="{ApplicationSender}" WorkstationID="{WorkstationID}" MessageID="1">
            # <POSdata>
            # <POSTimeStamp>{str(datetime.now().strftime("%Y-%m-%dT%H:%M:%S"))}</POSTimeStamp>
            # </POSdata>
            # </POSMessage>
            # """
            
            # header_length = len(xml_content).to_bytes(4, byteorder='big')
            # header_algorithm = int("0000").to_bytes(2, byteorder='big')
            # header = header_length + header_algorithm

            # sock.settimeout(20)
            # sock.sendall(header+xml_content.encode('utf-8'))
            

        


except Exception as e:
    print("An error occurred:", e)

finally:
    # Close the socket
    sock.close()
    
