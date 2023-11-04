import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.svm import SVC
from sklearn import metrics
import time

df = pd.read_csv(r'C:\Users\Yasith Bagya\Downloads\Telegram Desktop\HiPhish 1.0\ML Algorithm Evaluation\dataset_phishing.csv')
df = df.dropna()
df['status'] = df['status'].replace({'Phishing': -1, 'Legitimate': 1})
features = ['ip', 'nb_com', 'length_url', 'nb_hyphens', 'port', 'nb_redirection', 'nb_external_redirection', 'external_favicon', 'iframe','length_hostname','nb_dots','nb_subdomains', 'nb_hyperlinks']
X = df[features]
y = df['status']

def calculate_metrics(y_test, Y_predicted):
    accuracy = metrics.accuracy_score(y_test, Y_predicted)
    print("accuracy = " + str(round(accuracy * 100, 2)) + "%")

    confusion_mat = metrics.confusion_matrix(y_test, Y_predicted)
    print(confusion_mat)
    
    TP = confusion_mat[0, 0]
    FP = confusion_mat[0, 1]
    FN = confusion_mat[1, 0]
    TN = confusion_mat[1, 1]
    sensitivity = TP / (TP + FN)
    specificity = TN / (TN + FP)
    
    print("Sensitivity:", sensitivity)
    print("Specificity:", specificity)

def neural_network(X_train, X_test, y_train, y_test):
    model = MLPClassifier(hidden_layer_sizes=(100), activation='logistic', random_state=42)
    model.fit(X_train, y_train)
    Y_predicted = model.predict(X_test)
    return y_test, Y_predicted

def random_forests(X_train, X_test, y_train, y_test):
    model = RandomForestClassifier(n_estimators=5, criterion='entropy', random_state=42)
    model.fit(X_train, y_train)
    Y_predicted = model.predict(X_test)
    
    # Extract feature importances
    feature_importances = model.feature_importances_
    print("Feature Importances:", feature_importances)
    
    return y_test, Y_predicted


def support_vector_machines(X_train, X_test, y_train, y_test):
    model = SVC(kernel='rbf', C=2.0)
    model.fit(X_train, y_train)
    Y_predicted = model.predict(X_test)
    return y_test, Y_predicted

def main():
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

    print("\nrunning neural networks...")
    start_time = time.time()
    y_test, Y_predicted = neural_network(X_train, X_test, y_train, y_test)
    calculate_metrics(y_test, Y_predicted)
    end_time = time.time()
    print("runtime = " + str(end_time - start_time) + " seconds")

    print("\nrunning random forests...")
    start_time = time.time()
    y_test, Y_predicted = random_forests(X_train, X_test, y_train, y_test)
    calculate_metrics(y_test, Y_predicted)
    end_time = time.time()
    print("runtime = " + str(end_time - start_time) + " seconds")

    print("\nrunning support vector machines...")
    start_time = time.time()
    y_test, Y_predicted = support_vector_machines(X_train, X_test, y_train, y_test)
    calculate_metrics(y_test, Y_predicted)
    end_time = time.time()
    print("runtime = " + str(end_time - start_time) + " seconds")

if __name__ == '__main__':
    start_time = time.time()
    main()
    end_time = time.time()
    print("Total runtime = " + str(end_time - start_time) + " seconds")
