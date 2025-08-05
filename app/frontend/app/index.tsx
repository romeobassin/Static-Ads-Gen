import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Image,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

const { width } = Dimensions.get('window');

export default function Index() {
  const [selectedTemplate, setSelectedTemplate] = useState("simple_ad");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const templates = [
    { id: "simple_ad", name: "Simple Ad", icon: "document-text" as const },
    { id: "discount_ad", name: "Discount Ad", icon: "pricetag" as const },
    { id: "feature_highlight", name: "Feature Highlight", icon: "star" as const }
  ];

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Sorry, we need camera roll permissions to access your photos."
      );
      return false;
    }
    return true;
  };

  const handleImageImport = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri);
        setAnalysisResult(null);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const handleCameraCapture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Sorry, we need camera permissions to take photos."
      );
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri);
        setAnalysisResult(null);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to capture image. Please try again.");
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      "Select Image",
      "Choose how you want to add an image",
      [
        {
          text: "Camera",
          onPress: handleCameraCapture,
        },
        {
          text: "Photo Library",
          onPress: handleImageImport,
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setIsDropdownOpen(false);
    setAnalysisResult(null);
  };

  const clearImage = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
  };

  const analyzeImage = async () => {
    console.log("Analyze button pressed");
    console.log("Selected image:", selectedImage);
    console.log("Selected template:", selectedTemplate);
    
    if (!selectedImage) {
      Alert.alert("Error", "Please select an image first.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      console.log("Starting image analysis...");
      
      const response = await fetch(selectedImage);
      console.log("Image fetch response:", response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }
      
      const blob = await response.blob();
      console.log("Blob created, size:", blob.size);
      
      if (blob.size === 0) {
        throw new Error("Image data is empty or corrupted");
      }
      
      const reader = new FileReader();
      
      reader.onload = async () => {
        console.log("FileReader onload triggered");
        const base64Image = reader.result as string;
        const imageData = base64Image.split(',')[1];

        if (!imageData) {
          throw new Error("Failed to convert image to base64");
        }

        const payload = {
          image: imageData,
          template: selectedTemplate
        };
        
        console.log("Sending payload to backend...");
        console.log("Payload template:", payload.template);

        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 30000);
          
          const apiResponse = await fetch('http://192.168.0.36:5000/generate_ad', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            signal: controller.signal,
          });

          clearTimeout(timeoutId);
          console.log("Backend response status:", apiResponse.status);

          if (apiResponse.ok) {
            const result = await apiResponse.json();
            console.log("Analysis result received:", result);
            
            if (result.error) {
              throw new Error(result.error);
            }
            
            setAnalysisResult(result.result || result.description || JSON.stringify(result));
          } else {
            let errorMessage = `Server error: ${apiResponse.status}`;
            try {
              const errorData = await apiResponse.text();
              errorMessage += ` - ${errorData}`;
            } catch (e) {
              errorMessage += " - Unable to read error details";
            }
            throw new Error(errorMessage);
          }
        } catch (fetchError) {
          console.error("Fetch error:", fetchError);
          
          if (fetchError instanceof Error) {
            if (fetchError.name === 'AbortError') {
              throw new Error("Request timed out. Please check your connection and try again.");
            } else if (fetchError.message.includes('Network request failed')) {
              throw new Error("Cannot connect to server. Please check if the backend is running on port 5000 at 192.168.0.36.");
            } else if (fetchError.message.includes('Failed to fetch')) {
              throw new Error("Network error. Please check your internet connection and try again.");
            } else {
              throw new Error(`Network error: ${fetchError.message}`);
            }
          } else {
            throw new Error("Unknown network error occurred");
          }
        }
      };

      reader.onerror = (error) => {
        console.error("FileReader error:", error);
        Alert.alert("Error", "Failed to process image data. Please try with a different image.");
        setIsAnalyzing(false);
      };

      reader.readAsDataURL(blob);

    } catch (error) {
      console.error('Analysis error:', error);
      
      let errorMessage = "Failed to analyze image";
      
      if (error instanceof Error) {
        if (error.message.includes("Cannot connect to server")) {
          errorMessage = "Server Connection Failed\n\nPlease make sure:\n• Backend server is running\n• Server is on port 5000\n• No firewall blocking the connection";
        } else if (error.message.includes("timed out")) {
          errorMessage = "Request Timeout\n\nThe server is taking too long to respond. Please try again.";
        } else if (error.message.includes("Network")) {
          errorMessage = "Network Error\n\nPlease check your internet connection and try again.";
        } else {
          errorMessage = error.message;
        }
      }
      
      Alert.alert(
        "Analysis Failed", 
        errorMessage
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="sparkles" size={32} color="#6366F1" />
            <Text style={styles.title}>STATICO</Text>
          </View>
          <Text style={styles.subtitle}>AI-Powered Image Analysis</Text>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Template Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Template</Text>
            <View style={styles.dropdownContainer}>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                activeOpacity={0.7}
              >
                <View style={styles.dropdownContent}>
                  <Ionicons 
                    name={templates.find(t => t.id === selectedTemplate)?.icon || "document"} 
                    size={20} 
                    color="#6366F1" 
                  />
                  <Text style={styles.dropdownText}>
                    {templates.find(t => t.id === selectedTemplate)?.name || "Select Template"}
                  </Text>
                </View>
                <Ionicons
                  name={isDropdownOpen ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#6366F1"
                />
              </TouchableOpacity>
              
              {isDropdownOpen && (
                <View style={styles.dropdownList}>
                  {templates.map((template) => (
                    <TouchableOpacity
                      key={template.id}
                      style={[
                        styles.dropdownItem,
                        selectedTemplate === template.id && styles.dropdownItemSelected
                      ]}
                      onPress={() => handleTemplateSelect(template.id)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.dropdownItemContent}>
                        <Ionicons 
                          name={template.icon} 
                          size={18} 
                          color={selectedTemplate === template.id ? "#6366F1" : "#6B7280"} 
                        />
                        <Text style={[
                          styles.dropdownItemText,
                          selectedTemplate === template.id && styles.dropdownItemTextSelected
                        ]}>
                          {template.name}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Image Import Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Import Image</Text>
            {selectedImage ? (
              <View style={styles.imageContainer}>
                <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
                <View style={styles.imageActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={showImageOptions}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="refresh" size={20} color="#6366F1" />
                    <Text style={styles.actionButtonText}>Change</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={clearImage}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="trash" size={20} color="#EF4444" />
                    <Text style={[styles.actionButtonText, { color: "#EF4444" }]}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.importButton}
                onPress={showImageOptions}
                activeOpacity={0.8}
              >
                <View style={styles.importButtonContent}>
                  <View style={styles.importIconContainer}>
                    <Ionicons name="image-outline" size={32} color="#6366F1" />
                  </View>
                  <Text style={styles.importButtonText}>Choose Image</Text>
                  <Text style={styles.importButtonSubtext}>
                    Tap to select an image for analysis
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>

          {/* Preview Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preview</Text>
            <View style={styles.previewContainer}>
              {selectedImage ? (
                <View style={styles.analysisContainer}>
                  <View style={styles.analysisHeader}>
                    <View style={styles.analysisIconContainer}>
                      <Ionicons name="analytics" size={24} color="#6366F1" />
                    </View>
                    <Text style={styles.analysisTitle}>Analysis Ready</Text>
                  </View>
                  <Text style={styles.analysisText}>
                    Template: {templates.find(t => t.id === selectedTemplate)?.name}
                  </Text>
                  <TouchableOpacity
                    style={[styles.analyzeButton, isAnalyzing && styles.analyzeButtonDisabled]}
                    onPress={analyzeImage}
                    disabled={isAnalyzing}
                    activeOpacity={0.8}
                  >
                    <Ionicons 
                      name={isAnalyzing ? "hourglass" : "play"} 
                      size={20} 
                      color="#FFFFFF" 
                    />
                    <Text style={styles.analyzeButtonText}>
                      {isAnalyzing ? "Analyzing..." : "Analyze Image"}
                    </Text>
                  </TouchableOpacity>
                  
                  {/* Analysis Result */}
                  {analysisResult && (
                    <View style={styles.resultContainer}>
                      <View style={styles.resultHeader}>
                        <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                        <Text style={styles.resultTitle}>Analysis Complete</Text>
                      </View>
                      <View style={styles.resultContent}>
                        <Text style={styles.resultText}>{analysisResult}</Text>
                      </View>
                    </View>
                  )}
                </View>
              ) : (
                <View style={styles.previewPlaceholder}>
                  <View style={styles.placeholderIconContainer}>
                    <Ionicons name="image" size={48} color="#D1D5DB" />
                  </View>
                  <Text style={styles.previewText}>No image selected</Text>
                  <Text style={styles.previewSubtext}>
                    Import an image to see the analysis preview
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
    marginTop: 20,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1F2937",
    marginLeft: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
  },
  dropdownContainer: {
    position: "relative",
  },
  dropdownButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  dropdownContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  dropdownText: {
    fontSize: 16,
    color: "#1F2937",
    marginLeft: 12,
    fontWeight: "500",
  },
  dropdownList: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  dropdownItemSelected: {
    backgroundColor: "#F0F9FF",
  },
  dropdownItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#1F2937",
    marginLeft: 12,
  },
  dropdownItemTextSelected: {
    color: "#6366F1",
    fontWeight: "600",
  },
  importButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 32,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  importButtonContent: {
    alignItems: "center",
  },
  importIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F0F9FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  importButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6366F1",
    marginBottom: 8,
  },
  importButtonSubtext: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  imageContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  selectedImage: {
    width: "100%",
    height: 200,
    borderRadius: 16,
    marginBottom: 16,
  },
  imageActions: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    minWidth: 100,
    justifyContent: "center",
  },
  actionButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "500",
  },
  previewContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  previewPlaceholder: {
    alignItems: "center",
    paddingVertical: 40,
  },
  placeholderIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  previewText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6B7280",
    marginBottom: 4,
  },
  previewSubtext: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
  },
  analysisContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  analysisHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  analysisIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F0F9FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  analysisTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  analysisText: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 24,
    textAlign: "center",
  },
  analyzeButton: {
    backgroundColor: "#6366F1",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#6366F1",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  analyzeButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  analyzeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  resultContainer: {
    marginTop: 24,
    width: "100%",
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginLeft: 8,
  },
  resultContent: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  resultText: {
    fontSize: 14,
    color: "#1F2937",
    lineHeight: 20,
  },
});
